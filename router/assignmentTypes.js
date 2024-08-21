const router = require('express').Router()
const assignmentTypesController = require('../controller/assignmentTypesController')



router.post('/create', assignmentTypesController.createAssignmentType)

router.get('/all/:id', assignmentTypesController.getAllAssignmentTypes)

// router.post('/edit/:id', coursesController.editCourse)

// router.post('/delete/:id', coursesController.deleteCourse)



module.exports = router




