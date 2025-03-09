const router = require("express").Router();
const groupStudentAssignmentsController = require("../controller/groupStudentAssignmentsController");


router.get("/all/bymodule/:id", groupStudentAssignmentsController.getAllGroupStudentAssignmentsByModule);

router.post("/all/bymodule/completed/:id", groupStudentAssignmentsController.getAllGroupStudentAssignmentsByModuleByCompleted);

module.exports = router;