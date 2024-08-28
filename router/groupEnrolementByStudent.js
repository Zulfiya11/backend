const router = require('express').Router()
const groupEnrolementByStudentController = require('../controller/groupEnrolementByStudentController')



router.post('/create', groupEnrolementByStudentController.createGroupEnrolementByStudent)

router.get('/all/:id', groupEnrolementByStudentController.getaAllGroupEnrolementByStudent)

router.post('/delete/:id', groupEnrolementByStudentController.deleteGroupEnrolementByStudent)



module.exports = router




