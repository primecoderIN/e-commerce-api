const User = require("../models/user");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/CustomError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");

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

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("User does not exists", 400));
  }
  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const redirectUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${redirectUrl}`;
  //sending email now
  try {
    //Send mail here in this part for resetting password
    res.status(200).json({ success: true, message: redirectUrl });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.orgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is invalid or expired"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("Password and confirm password should match"));
  }

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.orgotPasswordExpiry = undefined;
  await user.save();
  res.status(200).json({ success: true, message: "Password reset successful" });
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserPassword = BigPromise(async (req, res, next) => {
  const UserId = req.user.id;

  const user = await User.findById(UserId).select("+password");
  const isCorrectOldPassword = await user.validatePassword(
    req.body.oldPassword
  );
  if (!isCorrectOldPassword) {
    return next(new CustomError("Old password is incorrect", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  cookieToken({ User: user, res });
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req?.files?.photo) {
    const user = await User.findById(req.user.id);
    const coludinaryPhotoId = user.photo.id;
    await cloudinary.uploader.destroy(coludinaryPhotoId);
    const uploadResponse = await cloudinary.uploader.upload(
      req.files.photo.tempFilePath,
      {
        use_filename: true,
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );
    newData.photo = {
      id: uploadResponse?.public_id,
      secure_url: uploadResponse?.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, User: user });
});

exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({ success: true, users });
});

exports.managerAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });
  res.status(200).json({ success: true, users });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new CustomError("user does not exists", 400));
  }
  res.status(200).json({ user });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new CustomError("user does not exists", 400));
  }
  //if i delete user first i will have no reference of photo so delete photo first
  const coludinaryPhotoId = user.photo.id;
  await cloudinary.uploader.destroy(coludinaryPhotoId);

  await user.remove();
  res.status(200).json({ success: true });
});
