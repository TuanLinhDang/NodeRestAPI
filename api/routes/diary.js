const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Diary = require('../models/diary')
const User = require('../models/user')
// const multer = require('multer')
// const storage = multer.memoryStorage()
// var upload = multer({storage: storage})
// var AWS = require("aws-sdk")


router.get('/:userId/:page', (req, res, next) => {
    const page = req.params.page
    if(page === 0){
        Diary.find(
            {by: req.params.userId}
        )
        .sort({_id: -1})
        .skip()
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                diaries: result
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                err: error
            })
        })
    } else {
        Diary.find(
            {by: req.params.userId}
        )
        .sort({_id: -1})
        .skip(page * 10)
        .limit(10)
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                diaries: result
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                err: error
            })
        })
    }
    
})
router.post('/:userId', (req, res, next) => {
    const userId = req.params.userId
    const date = new Date()
    User.find({
        _id: userId
    })
    .exec()
    .then(user => {
        if(user.length >= 1){
            const diary = new Diary({
                _id: new mongoose.Types.ObjectId(),
                postImage: req.body.postImage,
                date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
                title: req.body.title,
                detail: req.body.detail,
                by: userId,
                s3Key: req.body.s3Key
            })
            diary.save()
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            })
        } else{
            res.json({
                message: 'invalid Id'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    
})

module.exports = router