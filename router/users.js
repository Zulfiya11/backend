const router = require('express').Router()
const usersController = require('../controller/usersController')
// const {protect,role} = require('../middleware/auth-middleware')

router.get('/all', usersController.getAllUsers)

router.post('/create/:id', usersController.createUser)

router.post('/edit/:id', usersController.editUser)

router.post('/login', usersController.login)

router.post('/forgotpassword',usersController.forgotPassword)

router.get("/me", usersController.me);

router.post("/application/create", usersController.createUserApplication);

router.get("/application/all", usersController.getAllUserApplications);

router.post("/application/edit/:id", usersController.editUserApplication);

router.post("/application/deny/:id", usersController.denyUserApplication);



module.exports = router




