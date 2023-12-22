const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default:"Basic",

    }
   
});

const UserModel = mongoose.model("getusers", UserSchema);

module.exports = UserModel;
