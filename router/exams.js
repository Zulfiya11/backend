const router = require("express").Router();
const examsController = require("../controller/examsController");

router.post("/create/:id", examsController.createExam);
router.get(
    "/allbystudentbymodule/:id",
    examsController.getAllExamsByStudentByModule
);
router.post(
    "/allbystudentbymodulecompleted/:id",
    examsController.getAllExamsByStudentByModuleOnlyCompleted
);
router.post("/allforgroup/:id", examsController.getAllExamsResultsForGroup);
router.get("/allquestions/:id", examsController.getAllQuestionsByExam);
router.post("/answers", examsController.answers);

router.get("/getanswers/:id", examsController.getAnswers);
// router.get('/all', daysController.getaAllDays)
// router.get('/all', daysController.getaAllDays)

module.exports = router;
