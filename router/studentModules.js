const router = require("express").Router();
const studentModulesController = require("../controller/studentModulesController.js");



router.post("/create/:id", studentModulesController.createStudentModule);

router.get("/all/bystudent/forregister/:id", studentModulesController.getAllStudentModulesByStudentForRegister);

router.get("/all/applied", studentModulesController.getAllStudentModulesApplied);

router.post("/create/byadmin/:id", studentModulesController.createStudentModuleByAdmin);

router.delete("/delete/:id", studentModulesController.deleteStudentModuleByAdmin);

router.get("/all/bystudent", studentModulesController.getAllStudentModulesByStudent);

module.exports = router;
  