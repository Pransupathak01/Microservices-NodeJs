const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: String,
    emai: String,
    password: String,
    role:{
        type:String,
        default:"basic user"
    }
})
const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel