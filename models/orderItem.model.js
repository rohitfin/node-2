const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_product",
      required: true,
    },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

const orderItem = mongoose.model("tbl_order_item", orderItemSchema);

module.exports = orderItem;
