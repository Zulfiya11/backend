const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./router/users')
const courseRouter = require('./router/courses')
const moduleRouter = require('./router/modules')
const assignmentTypeRouter = require('./router/assignmentTypes')
const subjectRouter = require('./router/subjects')
const lessonRouter = require('./router/lessons')
const lessonReportTypeRouter = require('./router/lessonReportTypes')
const roomRouter = require('./router/rooms')
const lessonUnitRouter = require('./router/lessonUnits')
const assignmentRouter = require('./router/assignments')
const questionRouter = require('./router/questions')
const groupRouter = require('./router/groups')
const groupStudentRouter = require('./router/groupStudents')
const groupLessonRouter = require('./router/groupLessons')
const groupLessonReportRouter = require('./router/groupLessonReport')
const groupAttendanceRouter = require('./router/groupAttendance')
const questionLevelRouter = require('./router/questionLevels')
const assignmentLevelRouter = require('./router/assignmentLevels')
const studentModulesRouter = require('./router/studentModules')
const groupStudentAssignmentsRouter = require("./router/groupStudentAssignments");
const groupStudentAssignmentQuestionsRouter = require('./router/groupStudentAssignmentQuestions')
const leadsRouter = require("./router/leads");
const billsRouter = require("./router/bills");



const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// parse application/json
app.use(bodyParser.json())


    app.use("/users", userRouter),
    app.use("/courses", courseRouter),
    app.use("/modules", moduleRouter),
    app.use("/studentmodules", studentModulesRouter),
    app.use("/assignmenttypes", assignmentTypeRouter),
    app.use("/subjects", subjectRouter),
    app.use("/lessons", lessonRouter),
    app.use("/lessonreporttypes", lessonReportTypeRouter),
    app.use("/rooms", roomRouter),
    app.use("/lessonunits", lessonUnitRouter),
    app.use("/assignments", assignmentRouter),
    app.use("/questions", questionRouter),
    app.use("/groups", groupRouter),
    app.use("/groupstudents", groupStudentRouter),
    app.use("/grouplessons", groupLessonRouter),
    app.use("/grouplessonreports", groupLessonReportRouter),
    app.use("/groupattendance", groupAttendanceRouter),
    app.use("/questionlevels", questionLevelRouter),
    app.use("/assignmentlevels", assignmentLevelRouter),
    app.use("/groupstudentassignmentquestions", groupStudentAssignmentQuestionsRouter),
    app.use("/groupstudentassignments", groupStudentAssignmentsRouter);
    app.use("/leads", leadsRouter);
    app.use("/bills", billsRouter);



app.listen(3000, () => {
    console.log('server is running');
})