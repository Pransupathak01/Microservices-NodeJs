const express = require("express");
const router = express.Router();
const UserModel = require("../model/user");

router.post("/register", async (req, res) => {
    try {
        const { username, password,role } = req.body;      
        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Username and password are required",
            });
        }
        const user = await UserModel.create({ username, password,role });
        res.status(200).json({
            status: "OK",
            message: "User successfully created",
            user: {
                username: user.username,
                role: user.role
                
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: "Failed to create user",
            error: err.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;  

        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Username and password are required",
            });
        }
        const user = await UserModel.findOne({ username, password })
        if (!user){
            res.status(401).json({
                message: "Login not successful"
            })
        }else{
            res.status(200).json({
                message:"Login successful",
                user:{
                    username:user.username,
                    password:user.password,
                }
            })
        }
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: "Failed to login user",
            error: err.message,
        });
    }
});
module.exports = router;
