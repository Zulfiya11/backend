const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/users')
const applicationRouter = require('./router/applications')
const courseRouter = require('./router/courses')
const cors = require('cors')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// parse application/json
app.use(bodyParser.json())

app.use('/courses', courseRouter),

app.use('/users', userRouter),

app.use('/applications', applicationRouter)



app.listen(3000, () => {
    console.log('server is running');
})