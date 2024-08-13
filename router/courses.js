const router = require('express').Router()
const coursesController = require('../controller/coursesController')



router.post('/create', coursesController.createCourse)

router.get('/all', coursesController.getaAllCourses)


// router.post('/login', usersController.login)

// router.post('/repassword',usersController.forgotPassword)



module.exports = router




