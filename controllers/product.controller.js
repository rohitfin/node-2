const orderItem = require("../models/orderItem.model");
const productModel = require("../models/product.model");
const mongoose = require("mongoose");

const getProduct = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Products fetch successfully!",
  });
};

const getProductList = async (req, res) => {
  try {
    const { name, price, color, isActive, page = 1, limit = 10 } = req.body;

    const query = {};

    if (typeof name == "string" && name.trim()) {
      query.name = { $regex: name, $options: "i" };
    }

    if (typeof price == "number") {
      query.price = { $regex: price, $options: "i" };
    }

    if (typeof color == "string" && color.trim()) {
      query.color = { $regex: color, $options: "i" };
    }
    if (typeof isActive == "boolean") {
      query.price = isActive;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await productModel
      .find(query)
      .select("name price color")
      .skip(skip)
      .limit(limit);

    const total = await productModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      message:
        products.length === 0
          ? "No users found"
          : "User list fetched successfully",
      meta: {
        page: page,
        limit: limit,
        length: total,
        totalPage: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, color, price, ...body } = req.body;

    if (!name || !color || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await productModel.findOne({
      name: name,
      color: color,
    });

    if (product) {
      return res.status(400).json({
        success: false,
        message: "Product is all ready added",
      });
    }

    const newProduct = await productModel.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

const addMultipleProducts = async (req, res) => {
  try {
    const productArray = req.body;

    if (!Array.isArray(productArray)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array of products",
      });
    }

    const products = await productModel.insertMany(productArray);

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      length: products.length,
      product: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

const getProductSummary = async (req, res) => {
  try {
    // products total price

    const products = await productModel.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$color",
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "products fetched successfully!",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Requirements Use $lookup + $group Sort by total quantity DESC Return top 5 products
const getTopSelling = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    // pagination
    const page = Math.max(parseInt(req.body.page) || 1, 1);
    const limit = Math.max(parseInt(req.body.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const result = await orderItem.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQty: { $sum: "$quantity" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalQty: 1 } }, // sorting by total Quantity 
      { $limit: limit },
      { $skip: skip },
      {
        $lookup: {
          from: "tbl_products",
          localField: "_id", // productId -> using '_id' because of on $group used $productId
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          price: "$product.price",
          totalQty: 1,
          orderCount: 1,
          product: "$product"
        },
      },
    ]);

    const ret = result;

    return res.status(200).json({
      success: true,
      message:
        ret && ret.length ? "product fetched successfully" : "No product found",
      meta: {
        page: page,
        limit: limit,
        totalRecord: 0,
      },
      data: ret,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getProduct,
  getProductList,
  addProduct,
  addMultipleProducts,
  getProductSummary,
  getTopSelling,
};
