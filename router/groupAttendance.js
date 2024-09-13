const router = require('express').Router()
const groupAttendanceController = require('../controller/groupAttendanceController')



router.post('/create/:id', groupAttendanceController.createGroupAttendance)

router.get('/all/:id', groupAttendanceController.getAllGroupAttendance)



module.exports = router




