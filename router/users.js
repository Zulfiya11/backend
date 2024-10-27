const router = require('express').Router()
const usersController = require('../controller/usersController')


router.get('/all', usersController.getAllUsers)

router.get('/supers', usersController.getAllSupers)

router.get('/staff', usersController.getAllStaff)

router.get('/module_leaders', usersController.getAllModuleLeaders)

router.get('/teachers', usersController.getAllTeachers)

router.get('/assistants', usersController.getAllAssistants)

router.get('/students', usersController.getAllStudents)

router.get('/guests', usersController.getAllGuests)

router.post('/create', usersController.createUser)

router.post('/edit', usersController.editUser)

router.post('/login', usersController.login)

router.post('/forgotpassword',usersController.forgotPassword)

router.get("/me", usersController.me);



module.exports = router




