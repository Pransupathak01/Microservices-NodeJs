const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
});

const UserModel = mongoose.model("getuser", UserSchema);

module.exports = UserModel;
