const router = require('express').Router()
const billsController = require('../controller/billsController')



router.get('/all', billsController.getAllBills)




module.exports = router




