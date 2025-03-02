const router = require("express").Router();
const subjectsController = require("../controller/subjectsController");

router.post("/create", subjectsController.createSubject);

router.get("/all/:id", subjectsController.getAllSubjects);

router.post("/edit/:id", subjectsController.editSubject);

module.exports = router;
