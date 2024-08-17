const router = require('express').Router()
const applicationsController = require('../controller/applicationsController')


router.get('/all', applicationsController.getAllPendingApplications)

router.get('/pending', applicationsController.getAllPendingApplications)

router.get('/accepted', applicationsController.getAllAcceptedApplications)

router.get('/denied', applicationsController.getAllDeniedApplications)

router.post('/create', applicationsController.createUserApplication)

router.post('/edit/:id', applicationsController.editUserApplication)

router.post('/deny/:id', applicationsController.denyUserApplication)

// router.post('/login', usersController.login)

// router.post('/repassword',usersController.forgotPassword)



module.exports = router