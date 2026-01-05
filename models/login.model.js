const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

const login = mongoose.model("tbl_logs", loginSchema);

module.exports = login;
