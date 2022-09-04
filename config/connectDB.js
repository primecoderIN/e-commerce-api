const mongoose = require("mongoose");

const connectDB = (URI) => {
  return mongoose
    .connect(URI)
    .then((res) => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log("Could not connect to DB");
    });
};

module.exports = connectDB;
