const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/users')
const applicationRouter = require('./router/applications')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/users', userRouter),

app.use('/applications', applicationRouter)



app.listen(3000, () => {
    console.log('server is running');
})