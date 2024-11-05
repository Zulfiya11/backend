const router = require('express').Router()
const examsController = require('../controller/examsController')



router.post('/create/:id', examsController.createExam)
router.post("/allbygroup/:id", examsController.getAllExamsByGroup);
router.post("/allforgroup/:id", examsController.getAllExamsResultsForGroup);
router.get('/allbystudent', examsController.getAllExamsByStudent)
router.post("/allquestions", examsController.getAllQuestionsByExam);
router.post("/answers", examsController.answers);

// router.get('/all', daysController.getaAllDays)
// router.get('/all', daysController.getaAllDays)




module.exports = router




