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
  let productObj = new WhereClause(Product.find(), req.query).search().filter();
  let products = productObj.base;
  const totalMatchingCount = products?.length;
  productObj.pager(resultsPerPage);
  products = await productObj.base;
  res
    .status(200)
    .json({ success: true, products, totalMatchingCount, totalProductCount });
});

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError(`No product found with ${req.params.id}`, 401));
  }

  res.status(200).json({ success: true, product });
});

exports.updateProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError(`No product found with ${req.params.id}`, 401));
  }
    
  if (req.files) {
    let imagesArray = [];
    for (let index = 0; index < product.photos.length; index++) {
      await cloudinary.uploader.destroy(product.photos[index].id);
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
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,{
      new:true,
      runValidators: true
    }
  );
  res.status(200).json({ success: true, product: updatedProduct });
});
