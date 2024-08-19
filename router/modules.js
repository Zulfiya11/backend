const router = require('express').Router()
const modulesController = require('../controller/modulesController')



router.post('/create', modulesController.createModule)

// router.get('/all', coursesController.getaAllCourses)

// router.post('/edit/:id', coursesController.editCourse)

// router.post('/delete/:id', coursesController.deleteCourse)

// router.post('/login', usersController.login)

// router.post('/repassword',usersController.forgotPassword)



module.exports = router




