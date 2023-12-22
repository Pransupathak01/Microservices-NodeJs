const amqp = require("amqplib");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const UserModel = require("./models/User");
const { default: next } = require("next");


const PORT = 4006;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/Demo")

var channel, connection;
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        await channel.assertQueue("login-queue")

    } catch (error) {
        console.log(error)
    }
}
connectQueue()

async function sendData(user) {
    try {
        await channel.sendToQueue("login-queue", Buffer.from(JSON.stringify(user)));
        console.log("A message is sent to queue");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
//Verify admin user jwt

const varifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("Token is Missing")
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json("Error with token")
            } else {
                if (decoded.role === "Admin") {
                    next()
                } else {
                    return res.json("not a Admin User")
                }
            }

        })
    }
}

app.get("/dashboard", varifyUser, async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await UserModel.findOne({ email, password })
        sendData(user);
        if (user) {
            res.status(200).json({
                status: "OK",
                message: "Admin User login Successfully",
               //token: jwt.sign({ email: user.email, _id: user._id }, 'RESTFULAPIs')

            });
        }
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: "Failed to create user",
            error: err.message,
        })
    }
})


//login user
app.post("/loginUser", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await UserModel.findOne({ email, password })
        sendData(user);
        if (!email || !password) {
            return res.status(400).json({
                status: "Error",
                message: "email and password are required",
            });
        }
        if (user) {
            const token = jwt.sign({ email: user.email, role: user.role },
                "jwt-secret-key", { expiresIn: '1d' })
            res.cookie('token', token)
            res.status(200).json({
                status: "OK",
                message: "User login Successfully",
                user: {
                    email: user.email,
                    role: user.role,
                }
            });

        } else {
            res.status(401).json({
                message: "Login not successful"
            })
        }
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: "Failed to create user",
            error: err.message,
        })
    }
})

app.listen(PORT, () => {
    console.log(PORT + " Server is Running");
});