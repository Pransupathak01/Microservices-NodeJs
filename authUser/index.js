const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const userRoute = require("./Auth/auth");

const PORT = 4005;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectDB();

app.use("/auth", userRoute);

app.listen(PORT, () => {
    console.log("Server is Running " + PORT);
});