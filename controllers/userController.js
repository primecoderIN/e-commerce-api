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
    return next("Email already exists", 400);
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
