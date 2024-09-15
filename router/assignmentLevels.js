const router = require('express').Router()
const assignmentLevelsController = require('../controller/assignmentLevelsController.js')



router.post('/create/:id', assignmentLevelsController.createAssignmentLevel)

router.get('/all/:id', assignmentLevelsController.getAllAssignmentLevels)

router.post('/edit/:id', assignmentLevelsController.editAssignmentLevel)

router.post('/delete/:id', assignmentLevelsController.deleteAssignmentLevel)


module.exports = router




