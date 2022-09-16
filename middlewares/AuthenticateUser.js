const User = require("../models/user");
const BigPromise = require("./BigPromise");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");

exports.AuthenticateUser = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.headers("Authorization").replace("Bearer ", "");
  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});
