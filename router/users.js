const router = require('express').Router()
const usersController = require('../controller/usersController')
// const {protect,role} = require('../middleware/auth-middleware')

router.get('/all', usersController.getAllUsers)

router.get("/all/teachers", usersController.getAllTeachers);

router.get("/all/assistants", usersController.getAllAssistants);

router.post('/create', usersController.createUser)

router.post('/edit/:id', usersController.editUser)

router.post('/login', usersController.login)

router.post('/forgotpassword',usersController.forgotPassword)

router.get("/me", usersController.me);

router.get("/number", usersController.getTheNumberOfUsers)




module.exports = router




