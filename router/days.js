const router = require('express').Router()
const daysController = require('../controller/daysController')



router.get('/all', daysController.getaAllDays)




module.exports = router




