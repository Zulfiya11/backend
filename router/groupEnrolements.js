const router = require('express').Router()
const groupEnrolementsController = require('../controller/groupEnrolementsController')



router.post('/create', groupEnrolementsController.createGroupEnrolement)

router.get('/all', groupEnrolementsController.getAllGroupEnrolements)

router.post('/edit/:id', groupEnrolementsController.editGroupEnrolement)

router.post('/delete/:id', groupEnrolementsController.deleteGroupEnrolement)



module.exports = router




