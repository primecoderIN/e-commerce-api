require("dotenv").config(); //As .env is in root directory no need to pass anything in config function here
const app = require("./app.js");
const connectDB = require("./config/connectDB.js");
const cloudinary = require("cloudinary").v2;

//connect to db
connectDB(process.env.MONGO_URI);

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running port ${process.env.PORT}`);
});
