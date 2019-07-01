const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const ImagePost = require('../models/imagePost')
const Image = require('../models/image')


router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId
    ImagePost.find({
        by: userId
    })
    .exec()
    .then(user => {
        if(user.length >= 1){
            ImagePost.aggregate([
                {$project: {by: 1, category: 1, images: {$slice: ["$images", 10]}}},
                {$unwind: "$images"},
                {$lookup: {
                    from: 'images',
                    localField: 'images',
                    foreignField: '_id',
                    as: 'imageDetail'
                }},
                {$unwind: '$imageDetail'},
                {$group: {
                    _id: '$category',
                    "by" : {
                        "$first" : "$by"
                    },
                    // "category" : {
                    //     "$first" : "$category"
                    // },
                    //images: {$push: '$images'},
                    imageDetail: {$push: '$imageDetail'}
                }}
            ])
            .exec()
            .then(result => {
                console.log(result)
                res.status(200).json({
                    imagePost: result})
            })
            .catch(error => {
                console.log(error)
            })
        }
    }).catch(error => {
        console.log(error)
    })
})

router.get('/category/:userId/:category/:page', (req, res, next) => {
    const userId = req.params.userId
    const category = req.params.category
    const page = req.params.page
    if(page === 0){
        Image.find({
            by: userId,
            category: category
        })
        .limit(2)
        .sort({_id: -1})
        .exec()
        .then(result => {
            res.status(200).json({
                images: result
            })
        })
        .catch(err => {
            console.log(err)
        })
    } else{
        Image.find({
            by: userId,
            category: category
        })
        .skip(page * 2)
        .limit(2)
        .sort({_id: -1})
        .exec()
        .then(result => {
            res.status(200).json({
                images: result
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
})

router.post('/:userId', (req, res, next) => {
    const userId = req.params.userId
    var date = new Date()
    User.find({
        _id: userId
    })
    .exec()
    .then(user => {
        if(user.length >= 1){
            //add image to Image mongodb
            const image = new Image({
                _id: new mongoose.Types.ObjectId(),
                postImage: req.body.postImage,
                title: req.body.title,
                date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
                category: req.body.category,
                by: userId,
                s3Key: req.body.s3Key
            })
            image.save()
            .then(result => {
                //imagePost follow userId
                ImagePost.find(
                    {by: userId},
                )
                .exec()
                .then(result => {
                    if(result.length >= 1){
                        //find category to update or add new.
                        ImagePost.find(
                            {category: req.body.category}
                        )
                        .exec()
                        .then(doc => {
                            if(doc.length >= 1){
                                ImagePost.update(
                                    {by: userId},
                                    {$push: 
                                        {images: image._id,
                                        $position: 0}
                                    }
                                )
                                .exec()
                                .then(result => {
                                    console.log(result)
                                    res.json(result)
                                })
                                .catch(error => {
                                    console.log(error)
                                    res.json({
                                        err: error
                                    })
                                })
                            } else {
                                const imagePost = new ImagePost({
                                    by: userId,
                                    images: image._id,  
                                    category: req.body.category
                                })
                                imagePost.save()
                                .then(result => {
                                    console.log(result)
                                    res.json(result)
                                })
                                .catch(error => {
                                    console.log(error)
                                    res.json({
                                        err: error
                                    })
                                })
                            }
                        })
                    }
                    else {
                        const imagePost = new ImagePost({
                            by: userId,
                            images: image._id,
                            category: req.body.category
                        })
                        imagePost.save()
                        .then(result => {
                            console.log(result)
                            res.json(result)
                        })
                        .catch(error => {
                            console.log(error)
                            res.json({
                                err: error
                            })
                        })
                    }
                })
            })
            .catch(error => {
                res.json(error)
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

router.get('/newestImage/:userId', (req, res, next) => {
    const userId = req.params.userId
    Image.find({
        by: userId
    })
    .limit(5)
    .sort({_id: -1})
    .exec()
    .then( result => {
        res.status(200).json({
            bannerImages: result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router