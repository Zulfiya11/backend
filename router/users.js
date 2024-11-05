const router = require('express').Router()
const usersController = require('../controller/usersController')


router.get('/all', usersController.getAllUsers)

router.post('/create/:id', usersController.createUser)

router.post('/edit/:id', usersController.editUser)

router.post('/login', usersController.login)

router.post('/forgotpassword',usersController.forgotPassword)

router.get("/me", usersController.me);



module.exports = router




