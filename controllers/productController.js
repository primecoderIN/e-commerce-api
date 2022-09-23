const Product = require("../models/product");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/CustomError");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

exports.AddProduct = BigPromise(async (req, res, next) => {
  let imagesArray = [];
  if (!req.files) {
    return next(new CustomError("Please provide product images", 401));
  }
  for (let index = 0; index < req.files.photos.length; index++) {
    let result = await cloudinary.uploader.upload(
      req.files.photos[index].tempFilePath,
      {
        folder: "products",
      }
    );
    imagesArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    });
  }

  req.body.photos = imagesArray;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const resultsPerPage = 5;
  const totalProductCount = await Product.countDocuments();
  let products = new WhereClause(Product.find(), req.query).search().filter();
  const totalMatchingCount = products.length;
  products.pager(resultsPerPage);
  products = await products.base;
  res
    .status(200)
    .json({ success: true, products, totalMatchingCount, totalProductCount });
});
