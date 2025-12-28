const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

const getOrder = async (req, res) => {
  try {
    const order = await orderModel.find();

    if (!order) {
      return res.status(400).json({
        success: true,
        message: "No Order found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order fetch successfully!",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getOrderList = async (req, res) => {
  try {
    const body = req.body;

    const order = await orderModel.find(body);

    if (!order) {
      return res.status(200).json({
        success: true,
        message: "No Order found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order fetch successfully!",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
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

module.exports = { getOrder, getOrderList, addOrder, getOrderDetail };
