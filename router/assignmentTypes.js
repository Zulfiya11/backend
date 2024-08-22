const router = require('express').Router()
const assignmentTypesController = require('../controller/assignmentTypesController')



router.post('/create', assignmentTypesController.createAssignmentType)

router.get('/all/:id', assignmentTypesController.getAllAssignmentTypes)

router.post('/edit/:id', assignmentTypesController.editAssignmentType)

router.post('/delete/:id', assignmentTypesController.deleteAssignmentType)



module.exports = router




