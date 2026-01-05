const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const orderItemModel = require("../models/orderItem.model");







router.post("/getUserByOrder", async (req, res) => {
  try {
    const { userId } = req.body;

    const matchQuery = {};

    if (userId) {
      matchQuery["userId"] = new mongoose.Types.ObjectId(userId);
    }

    const orders = await orderModel.aggregate([
      //  Filter orders
      { $match: matchQuery },

      //  Join users
      {
        $lookup: {
          from: "tbl_users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      //  Join order items (FIXED)
      {
        $lookup: {
          from: "tbl_order_items",
          localField: "_id",
          foreignField: "orderId",
          as: "order_item",
        },
      },
      {
        $unwind: {
          path: "$order_item",
          preserveNullAndEmptyArrays: true,
        },
      },

      //  Shape response
      {
        $project: {
          _id: 1,
          createdAt: 1,

          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },

          order_item: {
            _id: "$order_item._id",
            quantity: "$order_item.quantity",
            productId: "$order_item.productId",
          },
        },
      },
    ]);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "users fetched successfully!",
      data: orders,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Server error",
      error,
    });
  }
});


module.exports = router;
