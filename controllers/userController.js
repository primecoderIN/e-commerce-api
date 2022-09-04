const User = require("../models/user");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new CustomError("All fields are mandatory.", 400));
  }
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next("Email already exists", 400);
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  user.password = undefined; //I do not want to sent password back to user after registration
  cookieToken({ User: user, res });
});
