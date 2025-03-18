const router = require('express').Router()
const groupAttendanceController = require('../controller/groupAttendanceController')



router.post('/create/:id', groupAttendanceController.createGroupAttendance)

router.get('/all/:id', groupAttendanceController.getAllGroupAttendance)

router.get('/all/bylesson/:id', groupAttendanceController.getAllGroupAttendanceByLesson)

router.post('/edit', groupAttendanceController.editGroupAttendance)

router.get("/all/bygroupstudent/:id", groupAttendanceController.getAllGroupAttendanceByGroupStudent);



module.exports = router




