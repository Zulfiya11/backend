const router = require('express').Router()
const coursesController = require('../controller/coursesController')



router.post('/create', coursesController.createCourse)

router.get('/all', coursesController.getaAllCourses)

router.post('/edit/:id', coursesController.editCourse)

router.post('/delete/:id', coursesController.deleteCourse)



module.exports = router




