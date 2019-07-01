const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

router.post('/socialLogin', (req, res, next) => {

    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            res.status(409).json({
                message: "Mail already exist"
            })
        } else {
            const user = new User({
                _id: req.body.id,
                email: req.body.email
            })
            user.save()
            .then(result => {
                res.status(201).json({
                    message: "user created"
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        }
    })

})

module.exports = router