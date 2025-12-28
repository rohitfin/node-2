const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_product",
      required: true,
    },
  },
  { timestamps: true }
);

const order = mongoose.model("tbl_order", orderSchema);

module.exports = order;
