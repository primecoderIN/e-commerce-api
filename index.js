require("dotenv").config() //As .env is in root directory no need to pass anything in config function here
const app = require("./app.js")
const connectDB = require("./config/connectDB.js")


connectDB(process.env.MONGO_URI)
app.listen(process.env.PORT, ()=> {
    console.log(`Server is running port ${process.env.PORT}`)
} )