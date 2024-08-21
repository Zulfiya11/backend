const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/users')
const applicationRouter = require('./router/applications')
const courseRouter = require('./router/courses')
const moduleRouter = require('./router/modules')
const assignmentTypeRouter = require('./router/assignmentTypes')
const unitRouter = require('./router/units')
const lessonRouter = require('./router/lessons')
const lessonReportTypesRouter = require('./router/lessonReportTypes')



// const cors = require('cors')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cors())
// parse application/json
app.use(bodyParser.json())


app.use('/assignmenttypes', assignmentTypeRouter),

app.use('/modules', moduleRouter),

app.use('/courses', courseRouter),

app.use('/users', userRouter),

app.use('/applications', applicationRouter),

app.use('/subjects', unitRouter),

app.use('/lessons', lessonRouter),

app.use('/lessonreporttypes', lessonReportTypesRouter)



app.listen(3000, () => {
    console.log('server is running');
})