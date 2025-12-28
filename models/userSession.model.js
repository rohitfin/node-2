const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
      required: true,
      index: true,
    },
    accessToken: { type: String, required: true, index: true },
    refreshToken: { type: String, required: true, index: true },
    accessTokenExpiresAt: { type: Date, required: true },
    refreshTokenExpiresAt: { type: Date, required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-delete expired sessions (TTL Index)
userSessionSchema.index({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

const userSession = mongoose.model("tbl_user_session", userSessionSchema);

module.exports = userSession;
