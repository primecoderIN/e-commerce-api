const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const YAML = require("yamljs")
const swaggerUi = require("swagger-ui-express")
require("dotenv").config();

const app = express();

//Routes
const HomeRoute = require("./routes/home")
const UserRoute = require("./routes/user")

//for swagger documentation
const SwaggerDocument = YAML.load("./swagger.yaml")
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(SwaggerDocument))

//Read requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(cookieParser())
//Logger
app.use(morgan("tiny"))

//using routes 
app.use("/",HomeRoute)
app.use("/api/v1", UserRoute);
module.exports = app;