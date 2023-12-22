const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 4000;
const UserModel = require("./models/User");

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
mongoose.connect("mongodb://localhost:27017/user")

app.post("/register", (req, res) => {
    const { name, email, password } = req.body
    UserModel.create({ name, email, password })
        .then(() => res.json({ status: "OK" }))
        .catch((err) => res.json(err));
})
app.listen(PORT, () => {
    console.log("Server is Running " + PORT)
})