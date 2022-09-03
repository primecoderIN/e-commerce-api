require("dotenv").config() //As .env is in root directory no need to pass anything in config function here
const app = require("./app.js")

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running port ${process.env.PORT}`)
} )