const router = require('express').Router()
const billsController = require('../controller/billsController')



router.get('/all', billsController.getAllBills)

router.post('/pay/:id', billsController.payBill)

router.get('/all/bymodule/bystudent/:id', billsController.getAllBillsByStudentByModule)




module.exports = router




