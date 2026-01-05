const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_orders",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_products",
      required: true,
    },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

const orderItem = mongoose.model("tbl_order_items", orderItemSchema);

module.exports = orderItem;
