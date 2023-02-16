const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "https://bit.ly/Default_Image"
    }
})

mongoose.model("UserModel", userSchema);