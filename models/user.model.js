const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: Number, required: true },
    role: { type: String, default: 'User' },
    
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_user" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_user" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true }
);

const user = mongoose.model("tbl_user", userSchema);
module.exports = user;
