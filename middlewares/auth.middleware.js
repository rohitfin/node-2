const jwt = require("jsonwebtoken");
const userSessionModel = require("../models/userSession.model");

const authMiddleware = async (req, res, next) => {
  try {
    console.log(req);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
     if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const session = await userSessionModel.findOne({
      accessToken: token,
      isActive: true
    });

    if (!session){
      return res.status(401).json({ message: "Session expired or logged out" });
    }

    req.user = payload;
    req.userId = session.userId;

    next();

  } catch (error) {
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired, please login again",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid token",
    error
  });
  }
};

module.exports = authMiddleware;
