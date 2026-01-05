const userModel = require("../models/user.model");
const userSessionModel = require("../models/userSession.model");
const jwt = require("jsonwebtoken");

const loginCredential = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not exist",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is not match",
      });
    }

    const refreshTokenExpiry = '7d';
    const refreshToken = await jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiry }
    );

    const accessTokenExpiry = '1d';
    const accessToken = await jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiry }
    );



    // Calculate expiry date
    const accessDecoded = jwt.decode(accessToken);
    const refreshDecoded = jwt.decode(refreshToken);

    // Check token all ready generate then replace with new 
    await userSessionModel.deleteOne({userId: user._id});
    
    await userSessionModel.create({
      userId: user._id,
      role: user.role,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: new Date(accessDecoded.exp * 1000),
      refreshTokenExpiresAt: new Date(refreshDecoded.exp * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      accessToken: accessToken,
      refreshToken,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error
    });
  }
};

module.exports = { loginCredential };
