const router = require('express').Router()
const lessonsController = require('../controller/lessonsController')



router.post('/create', lessonsController.createLesson)

router.get('/all/:id', lessonsController.getAllLessons)

// router.post('/edit/:id', coursesController.editCourse)

// router.post('/delete/:id', coursesController.deleteCourse)



module.exports = router




