const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
    postImage: {type: String, require: true},
    title: {type: String, require: true},
    date: {type: String, require: true},
    category: {type: String, require: true},
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    s3Key: {type: String}
})

module.exports = mongoose.model('Image', imageSchema)