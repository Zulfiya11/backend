const router = require('express').Router()
const unitsController = require('../controller/unitsController')



router.post('/create', unitsController.createUnit)

router.get('/all/:id', unitsController.getAllUnits)

router.post('/edit/:id', unitsController.editUnit)



module.exports = router




