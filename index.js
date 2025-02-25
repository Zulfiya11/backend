const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/users')
const courseRouter = require('./router/courses')
const moduleRouter = require('./router/modules')
const assignmentTypeRouter = require('./router/assignmentTypes')
const unitRouter = require('./router/units')
const lessonRouter = require('./router/lessons')
const lessonReportTypeRouter = require('./router/lessonReportTypes')
const roomRouter = require('./router/rooms')
const lessonUnitRouter = require('./router/lessonUnits')
const assignmentRouter = require('./router/assignments')
const questionRouter = require('./router/questions')
const groupEnrolementRouter = require('./router/groupEnrolements')
const moduleEnrolementByStudentRouter = require('./router/moduleEnrolementByStudent')
const groupRouter = require('./router/groups')
const groupStudentRouter = require('./router/groupStudents')
const groupLessonRouter = require('./router/groupLessons')
const dayRouter = require('./router/days')
const groupEnrolementDayRouter = require('./router/groupEnrolementDays')
const lessonReportByUserRouter = require('./router/lessonReportByUser')
const groupAttendanceRouter = require('./router/groupAttendance')
const questionLevelRouter = require('./router/questionLevels')
const assignmentLevelRouter = require('./router/assignmentLevels')
const studentModulesRouter = require('./router/studentModules')
const examRouter = require('./router/exams')

const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// parse application/json
app.use(bodyParser.json())


app.use('/users', userRouter),

app.use('/courses', courseRouter),

app.use('/modules', moduleRouter),

app.use('/studentmodules', studentModulesRouter),

app.use('/assignmenttypes', assignmentTypeRouter),

app.use('/subjects', unitRouter),

app.use('/lessons', lessonRouter),

app.use('/lessonreporttypes', lessonReportTypeRouter),

app.use('/rooms', roomRouter),

app.use('/lessonunits', lessonUnitRouter),

app.use('/assignments', assignmentRouter), 

app.use('/questions', questionRouter),

app.use('/groupenrolements', groupEnrolementRouter),

app.use('/moduleenrolementsbystudent', moduleEnrolementByStudentRouter),

app.use('/groups', groupRouter),

app.use('/groupstudents', groupStudentRouter),

app.use('/grouplessons', groupLessonRouter),

app.use('/days', dayRouter),

app.use('/groupenrolementdays', groupEnrolementDayRouter),

app.use('/lessonreportsbyuser', lessonReportByUserRouter),

app.use('/groupattendance', groupAttendanceRouter),

app.use('/questionlevels', questionLevelRouter),

app.use('/assignmentlevels', assignmentLevelRouter),

app.use('/exams', examRouter)

app.listen(3000, () => {
    console.log('server is running');
})