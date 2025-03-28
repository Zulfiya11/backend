const router = require('express').Router()
const billsController = require('../controller/billsController')



router.get('/all', billsController.getAllBills)

router.post('/pay/:id', billsController.payBill)

router.get('/all/bygroupstudent/:id', billsController.getAllBillsByGroupStudent)

router.get('/all/bystudent', billsController.getAllBillsByStudent)




module.exports = router




