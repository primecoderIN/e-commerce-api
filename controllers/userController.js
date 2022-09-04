const User = require("../models/user");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new CustomError("All fields are mandatory.", 400));
  }
  if (req.files) {
    result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
      use_filename: true,
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(new CustomError("Email already exists", 400));
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({
    name,
    email,
    password,
    role,
    photo: {
      id: result?.public_id,
      secure_url: result?.secure_url,
    },
  });
  user.password = undefined; //I do not want to sent password back to user after registration
  cookieToken({ User: user, res });
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new CustomError("Please provide valid email and password", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("User does not exist", 400));
  }

  const isPasswordCorrect = await user.validatePassword(password);

  if (!isPasswordCorrect) {
    return next(new CustomError("Invalid password", 400));
  }

  user.password = undefined;
  cookieToken({ User: user, res });
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
});
