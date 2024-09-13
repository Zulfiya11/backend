const router = require('express').Router()
const groupStudentsController = require('../controller/groupStudentsController')



router.post('/create/:id', groupStudentsController.createGroupStudent)

router.get('/all/:id', groupStudentsController.getAllGroupStudents)

router.post('/delete/:id', groupStudentsController.deleteGroupStudent)



module.exports = router




