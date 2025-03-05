const router = require('express').Router()
const groupAttendanceController = require('../controller/groupAttendanceController')



router.post('/create/:id', groupAttendanceController.createGroupAttendance)

router.get('/all/:id', groupAttendanceController.getAllGroupAttendance)

router.get('/all/bylesson/:id', groupAttendanceController.getAllGroupAttendanceByLesson)



module.exports = router




