const router = require('express').Router()
const groupEnrolementDaysController = require('../controller/groupEnrolementDaysController')



router.post('/create', groupEnrolementDaysController.createGroupEnrolementDay)

router.get('/all/:id', groupEnrolementDaysController.getAllGroupEnrolementDays)

router.post('/delete/:id', groupEnrolementDaysController.deleteGroupEnrolementDay)



module.exports = router




