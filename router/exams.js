const router = require('express').Router()
const examsController = require('../controller/examsController')



router.post('/create/:id', examsController.createExam)
router.get('/allbystudent', examsController.getaAllExamsByStudent)
router.post("/allquestions", examsController.getaAllQuestionsByExam);
router.post("/answers", examsController.answers);

// router.get('/all', daysController.getaAllDays)
// router.get('/all', daysController.getaAllDays)




module.exports = router




