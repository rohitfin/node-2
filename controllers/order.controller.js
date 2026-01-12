const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

const getOrder = async (req, res) => {
  try {
    const { orderId, productName, isActive, page = 1, limit = 3 } = req.body;

    const query = {};

    if (typeof productName == "string" && productName.trim()) {
      query.productName = { $regex: productName, $options: "i" };
    }

    if(typeof isActive == "boolean"){
      query.isActive = isActive;
    }

    // Pagination
    const skip = (page - 1) * limit;

    let order = [];
    if(orderId){
      order = await orderModel.find({_id: orderId});
    } else {
      order = await orderModel
      .find(query)
      .skip(skip)
      .limit(limit)
    }

    let total = await orderModel.countDocuments(query);

    if (!order) {
      return res.status(400).json({
        success: true,
        message: "No Order found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order fetch successfully!",
      meta: {
        page: page,
        limit: limit,
        length: total,
        totalPage: Math.ceil(total / limit),
      },
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const authUser = req.auth;

    if (!authUser || !authUser.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(authUser.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Pagination params
    const page = Math.max(parseInt(req.body.page) || 1, 1);
    const limit = Math.min(parseInt(req.body.limit) || 10, 100);
    const skip = (page - 1) * limit;

    // Query
    const query = {
      userId: authUser.userId,
      $or: [ // Handle both cases: field missing OR false
          { isDeleted: false },
          { isDeleted: { $exists: false } },
        ],
    };

    // DB calls
    const [orders, totalRecords] = await Promise.all([
      orderModel
        .find(query)
        .select("_id orderNumber totalAmount status createdAt userId") // Projection
        .populate({
          path: "userId",
          select: "name email"
        })
        .populate({
          path: "productId",
          select: "name price"
        })
        .sort({ createdAt: -1 }) // Sorting - Latest orders first
        .skip(skip)
        .limit(limit)
        .lean(),

      orderModel.countDocuments(query),
    ]);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      meta: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
      data: orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getOrderList = async (req, res) => {
  try {
    const loginUser = req.auth;

    if (!loginUser || !loginUser.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(loginUser.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const matchQuery = {};

    // ROLE BASED ACCESS
    if (loginUser.role === "User") {
      // User → only own orders
      matchQuery.userId = new mongoose.Types.ObjectId(loginUser.userId);
    }

    // Manager logic (example)
    // if (loginUser.role === "Manager") {
    //   matchQuery.createdBy = new mongoose.Types.ObjectId(loginUser.userId);
    // }

    // Admin → see all orders (no filter)
    // if (loginUser.role === "Admin") {}

    const orders = await orderModel.aggregate([
      { $match: matchQuery },

      {
        $lookup: {
          from: "tbl_products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $lookup: {
          from: "tbl_users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $project: {
          _id: 1,
          createdAt: 1,
          product: {
            _id: "$product._id",
            name: "$product.name",
            price: "$product.price",
          },
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ]);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const addOrder = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const order = await orderModel.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
const getOrderDetail = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order Id is required",
      });
    }

    const order = await orderModel.findById(_id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const product = await productModel.findById(order.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await userModel.findById(order.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        orderId: order._id,
        productId: product._id,
        productName: product.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
*/

const getOrderDetail = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order Id is required",
      });
    }

    const order = await orderModel
      .findById(_id)
      .populate("productId", "name")
      .populate("userId", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: order.userId.name,
        orderId: order._id,
        productId: order.productId._id,
        productName: order.productId.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



module.exports = {
  getOrder,
  getOrderList,
  addOrder,
  getOrderDetail,
  getMyOrders,
};
