const router = require('express').Router()
const groupAttendanceController = require('../controller/groupAttendanceController')



router.post('/create', groupEnrolementByStudentController.createGroupEnrolementByStudent)

router.get('/all/:id', groupAttendanceController.getAllGroupAttendance)



module.exports = router




