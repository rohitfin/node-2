const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_products",
      required: true,
    },
  },
  { timestamps: true }
);

const order = mongoose.model("tbl_orders", orderSchema);

module.exports = order;
