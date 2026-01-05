const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true }
);

const product = mongoose.model("tbl_products", productSchema);
module.exports = product;
