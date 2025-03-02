const router = require("express").Router();
const studentModulesController = require("../controller/studentModulesController.js");



router.post("/create/:id", studentModulesController.createStudentModule);

router.get("/all/bystudent/:id", studentModulesController.getAllStudentModulesByStudent);

router.get("/all/applied", studentModulesController.getAllStudentModulesApplied);

router.post("/create/byadmin/:id", studentModulesController.createStudentModuleByAdmin);

router.delete("/delete/:id", studentModulesController.deleteStudentModuleByAdmin);

// router.get("/allByStudent", studentModulesController.getAllModulesByStudent);

module.exports = router;
