const router = require("express").Router();
const assignmentsController = require("../controller/assignmentsController");

router.post("/create", assignmentsController.createAssignment);

router.get("/all/:id", assignmentsController.getAllAssignments);

router.post("/edit/:id", assignmentsController.editAssignment);

module.exports = router;
