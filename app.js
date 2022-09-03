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
module.exports = app;