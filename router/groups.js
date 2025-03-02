const router = require('express').Router()
const grouptsController = require('../controller/groupsController')



router.post('/create', grouptsController.createGroup)

router.get('/all', grouptsController.getAllGroups)

router.get("/all/byteacherorassisstant", grouptsController.getAllGroupsByTeacherOrAssistant);

router.post('/edit/:id', grouptsController.editGroup)

router.post('/delete/:id', grouptsController.deleteGroup)

router.post('/finish/:id', grouptsController.finishGroup)


module.exports = router




