const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel")
const {JWT_SECRET} = require('../config');

router.post("/signup", (req, res) => {
    const{fullName, email, password, profileImage} = req.body;
    if (!fullName || !password || !email) {
        return res.status(400).json({error: "One or more mandatory fields are empty"});
    }
    UserModel.findOne({email: email})
    .then((userInDB) => {
        if(userInDB) {
            return res.status(500).json({error: "User with this email already registered"});
        }
        bcrypt.hash(password, 16)
        .then((hashedPassword) => {
            const user = new UserModel({fullName, email, password: hashedPassword, profileImage});
            user.save()
            .then((newUser) => {
                res.status(201).json({result: "User Signed up Successfully!"});
            })
            .catch((err) => {
                console.log(err);
            })
        })
    })

});


router.post("/login", (req, res) => {
    const{ email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({error: "One or more mandatory fields are empty"});
    }
    UserModel.findOne({email: email})
    .then((userInDB) => {
        if(!userInDB) {
            return res.status(401).json({error: "Invalid Creditials"});
        }
        bcrypt.compare(password, userInDB.password)
        .then((didMatch) => {
                if(didMatch) {
                    const jwtToken = jwt.sign({_id: userInDB._id}, JWT_SECRET);
                    const userInfo = {"email": userInDB.email, "fullName": userInDB.fullName};

                    res.status(200).json({result: {token: jwtToken, user:userInfo}});
                } else {
                    res.status(401).json({error: "Invalid Credentials"});
                }
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    });


module.exports = router;