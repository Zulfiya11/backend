const router = require('express').Router()
const grouptsController = require('../controller/groupsController')



router.post('/create', grouptsController.createGroup)

router.get('/all', grouptsController.getAllGroups)

router.get("/all/byteacherorassisstant", grouptsController.getAllGroupsByTeacherOrAssistant);



module.exports = router




