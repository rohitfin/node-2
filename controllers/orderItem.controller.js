const orderItemModel = require("../models/orderItem.model");
const mongoose = require("mongoose");


const getOrderItem = async (req, res) => {
  try {
    const orderItem = await orderItemModel.find();

    if (!orderItem) {
      return res.status(400).json({
        success: true,
        message: "No OrderItem found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "OrderItem fetch successfully!",
      data: orderItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getOrderItemList = async (req, res) => {
  try {
    const body = req.body;

    const orderItem = await orderItemModel.find(body);

    if (!orderItem) {
      return res.status(200).json({
        success: true,
        message: "No OrderItem found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "OrderItem fetch successfully!",
      data: orderItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const addOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    if (!orderId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const orderItem = await orderItemModel.create(req.body);

    return res.status(200).json({
      success: true,
      message: "OrderItem created successfully",
      data: orderItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getOrderItemDetail = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order item Id",
      });
    }

    const orderItem = await orderItemModel
      .findById(_id)
      .populate("productId", "name")
      .populate({
        path: "orderId",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: orderItem.orderId.userId.name,
        orderItemId: orderItem._id,
        productId: orderItem.productId._id,
        productName: orderItem.productId.name,
        quantity: orderItem.quantity,
      },
      orderItemFullDetail: orderItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getOrderItem,
  getOrderItemList,
  addOrderItem,
  getOrderItemDetail,
};
