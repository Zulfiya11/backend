const router = require("express").Router();
const modulesController = require("../controller/modulesController.js");

router.post("/create", modulesController.createModule);

router.get("/all/:id", modulesController.getAllModules);

router.post("/edit/:id", modulesController.editModule);


// router.get("/allByStudent", modulesController.getAllModulesByStudent);

module.exports = router;
