const mongoose = require('mongoose')

const diarySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postImage: {type: String},
    date: {type: String, require: true},
    title: {type: String, require: true},
    detail: {type: String, require: true},
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    s3Key: {type: String}
})

module.exports = mongoose.model('Diary', diarySchema)