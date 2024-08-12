const router = require('express').Router()
const applicationsController = require('../controller/applicationsController')


router.get('/all', applicationsController.getAllUserApplications)

router.post('/create', applicationsController.createUserApplication)

router.post('/edit', applicationsController.editUserApplication)

router.post('/deny', applicationsController.denyUserApplication)

// router.post('/login', usersController.login)

// router.post('/repassword',usersController.forgotPassword)



module.exports = router