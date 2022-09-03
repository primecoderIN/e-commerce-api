const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    validate: [validator.isEmail, "Please provide a valid email address."],
    unique: [true, "Email already in use."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
});
//Encrypt password before saving/modifying
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//Verify password
UserSchema.methods.validatePassword = async function (userPassword) {
  const isVerified = await bcrypt.compare(userPassword, this.password);
  return isVerified;
};
//Create and return JWT token
UserSchema.methods.getJwtToken = function () {
  const token = JWT.sign(
    { id: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
  return token;
};

//Create forgot password token
UserSchema.methods.getForgotPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return token;
};

module.exports = mongoose.model("User", UserSchema);
