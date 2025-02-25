const router = require('express').Router()
const coursesController = require('../controller/coursesController')



router.post('/create', coursesController.createCourse)

router.get('/all', coursesController.getAllCourses)

router.post('/edit/:id', coursesController.editCourse)



module.exports = router




