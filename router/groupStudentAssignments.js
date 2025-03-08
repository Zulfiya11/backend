const router = require("express").Router();
const groupStudentAssignmentsController = require("../controller/groupStudentAssignmentsController");


router.get("/all/bymodule/:id", groupStudentAssignmentsController.getAllGroupStudentAssignmentsByModule);

    
module.exports = router;