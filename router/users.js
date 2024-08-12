const router = require('express').Router()
const usersController = require('../controller/usersController')


router.get('/all', usersController.getAllUsers)

router.post('/create', usersController.createUser)

router.post('/edit', usersController.editUser)

// router.post('/login', usersController.login)

// router.post('/repassword',usersController.forgotPassword)



module.exports = router




