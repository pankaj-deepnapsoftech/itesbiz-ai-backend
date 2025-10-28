const User = require("../Modals/userModal");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    
    try {
      if (token) {
        const secret = process.env.JWT_SECRET || "your-secret-key";
        const decoded = jwt.verify(token, secret);
        
        const user = await User.findById(decoded?.id);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found. Please login again.",
          });
        }
        req.user = user;
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: "No token provided. Please login.",
        });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
          code: "TOKEN_EXPIRED"
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again.",
          code: "INVALID_TOKEN"
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Please login again.",
          code: "AUTH_FAILED"
        });
      }
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "No token attached to header. Please login.",
    });
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    res.json("You are not an admin");
  } else {
    req.user = req.user;
    next();
  }
});
const isSuper = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email });
  if (adminUser.super === true) {
    req.user = req.user;
    next();
  } else {
    res.json("You are not Super admin");
  }
});
module.exports = { authMiddleware, isAdmin, isSuper };
