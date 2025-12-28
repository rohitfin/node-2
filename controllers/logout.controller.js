const { model } = require("mongoose");
const userSessionModel = require("../models/userSession.model");


const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  await userSessionModel.findOneAndUpdate(
    { token },
    {
      isActive: false,
      logoutAt: new Date()
    }
  );

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

module.exports = { logout };