const router = require("express").Router();
const groupStudentAssignmentQuestionsController = require("../controller/groupStudentAssignmentQuestionsController");



router.post(
    "/create/:id",
    groupStudentAssignmentQuestionsController.createGroupStudentAssignmentQuestions
);

router.get(
    "/all/byexam/:id",
    groupStudentAssignmentQuestionsController.getAllQuestionsByExam
);

router.post("/answers/:id", groupStudentAssignmentQuestionsController.answers);


router.get(
    "/answers/all/:id",
    groupStudentAssignmentQuestionsController.getAllGroupStudentAssignmentQuestionsByGroupStudentAssignment
);







router.post(
    "/allforgroup/:id",
    groupStudentAssignmentQuestionsController.getAllExamsResultsForGroup
);



// router.get('/all', daysController.getaAllDays)
// router.get('/all', daysController.getaAllDays)

module.exports = router;
