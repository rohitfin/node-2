const express = require("express");
const router = express.Router();
const userSessionModel = require("../models/userSession.model");
const jwt = require("jsonwebtoken");

router.post("", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const session = await userSessionModel.findOne({
    refreshToken,
    isActive: true,
  });

  if (!session) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "Refresh token expired" });
      }

      const newAccessToken = jwt.sign(
        { userId: payload.userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const decoded = jwt.decode(newAccessToken);

      session.accessToken = newAccessToken;
      session.accessTokenExpiresAt = new Date(decoded.exp * 1000);
      await session.save();

      res.status(200).json({
        accessToken: newAccessToken,
      });
    }
  );
});


module.exports = router;