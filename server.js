require("dotenv").config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const FileRoutes = require('./routes/file')

let models = require('./models')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())

app.set("view engine", "ejs")

models.sequelize.sync().then(() => {
    console.log("Database connected")
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })
}).catch(err => console.log(err))

app.use(FileRoutes)