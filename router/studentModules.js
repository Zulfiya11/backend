const router = require("express").Router();
const studentModulesController = require("../controller/studentModulesController.js");


router.get(
    "/all/student/:id",
    studentModulesController.getAllModulesByStudentForRegister
);

router.get("/allByStudent", studentModulesController.getAllModulesByStudent);

module.exports = router;
