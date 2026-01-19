const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");

const getUser = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Data fetch successfully!",
  });
};

const getUserList = async (req, res) => {
  try {
    const { name, email, isActive, page = 1, limit = 10, sort = "Descending" } = req.body;

    // Build query object manually
    const query = {};

    if (typeof name === "string" && name.trim()) {
      query.name = { $regex: name, $options: "i" };
    }

    if (typeof email === "string" && email.trim()) {
      query.email = { $regex: email, $options: "i" };
    }

    if (typeof isActive === "boolean") {
      query.isActive = isActive;
    }

    const sortOrder = sort === "Descending" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch users
    const users = await userModel
      .find(query)
      .select("name email") // only required fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder }); //createdAt: -1

    const total = await userModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      message:
        users.length === 0
          ? "No users found"
          : "User list fetched successfully",
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateUser = async (req, res)=>{
  try {
    const { _id, ...updateData } = req.body;

    const userExist = await userModel.findOne({_id : _id });

    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "User is not exist",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      _id, 
      updateData, 
      { new: true, runValidators: true }
    );

    return res.status(202).json({
      success: true,
      message: "User updated successfully!",
      data: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

const createUser = async (req, res) => {
  try {
    let body = req.body;

    // Validation
    if (!body.name || !body.email || !body.mobile) {
      return res.status(400).json({
        status: 400,
        message: "Fields are missing",
      });
    }

    // Check email already exists
    const existingUser = await userModel
      .findOne({ email: body.email }, { name: 1, email: 1 })
      .lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // create new user
    const user = await userModel.create({
      ...body
    });
      // createdBy: req.user?._id || null, createdIP: req.ip,

    return res.status(202).json({
      success: true,
      message: "User saved successfully!",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const userDelete = async (req, res) => {
  try {

    const loginUser = req.auth;

    if (!mongoose.Types.ObjectId.isValid(loginUser.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const { id } = req.params;

    // const user = await userModel.findOneAndUpdate(
    //   { _id: id, isDeleted: false },
    //   {
    //     $set: {
    //       isDeleted: true,
    //       deletedAt: new Date()
    //     },
    //   },
    //   { new: true }
    // )


    const user = await userModel.findOne(
      { _id: id,
        isDeleted: false
       }
    );
    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or already deleted.",
      });
    }

    if(user.role === "Admin"){
      return res.status(403).json({
        success: false,
        message: "Admin user cannot be deleted"
      })
    }

    user.isDeleted = true;
    user.deleteAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error
    });
  }
};

module.exports = { getUser, getUserList, createUser, updateUser, userDelete };
