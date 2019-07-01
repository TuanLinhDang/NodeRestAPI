const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//connect mongodb
mongoose.connect('mongodb+srv://tuanlinh:'+ process.env.PASSWORD + '@cluster0-undwq.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true },(err, db) => {
})

mongoose.set('useCreateIndex', true);

//diary Router
const diaryRouter = require('./api/routes/diary')
app.use('/diary', diaryRouter)

//imageRouter
const imageRouter = require('./api/routes/image')
app.use('/image', imageRouter)

//userRouter
const userRouter = require('./api/routes/user')
app.use('/user', userRouter)

//socialLogin
const socialLoginUser = require('./api/routes/socialLogin')
app.use('/login', socialLoginUser)

app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app
