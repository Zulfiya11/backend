const router = require('express').Router()
const modulesController = require('../controller/modulesController.js')



router.post('/create', modulesController.createModule)

router.get('/all/:id', modulesController.getAllModules)

router.post('/edit/:id', modulesController.editModule)

router.post('/delete/:id', modulesController.deleteModule)


module.exports = router




