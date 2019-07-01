const mongoose = require('mongoose')

const imagePost = mongoose.Schema({
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    category: {type: String},
    images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]
})

module.exports = mongoose.model('ImagePost', imagePost)