const router = require('express').Router()
const examsController = require('../controller/examsController')



router.post('/create/:id', examsController.createExam)
router.get('/all', examsController.getaAllExams)
// router.get('/all', daysController.getaAllDays)
// router.get('/all', daysController.getaAllDays)




module.exports = router




