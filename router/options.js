const router = require('express').Router()
const optionsController = require('../controller/optionsController.js')



router.post('/edit/:id', optionsController.editOption)


module.exports = router




