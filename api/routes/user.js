const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const ImagePost = require('../models/imagePost')

router.post('/create', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail Exist"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json(result)
                            })
                            .catch(error => {
                                console.log(error)
                                res.status(500).json({
                                    error: error
                                })
                            })
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if (result) {
                    return res.status(200).json(user)
                }
                return res.status(401).json({
                    message: "Auth failed"
                })
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
})

router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(user => {
        console.log(user)
        res.status(200).json(user)
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router