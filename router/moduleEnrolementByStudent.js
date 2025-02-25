const router = require('express').Router()
const moduleEnrolementByStudentController = require('../controller/moduleEnrolementByStudentController')



router.post('/create', moduleEnrolementByStudentController.createModuleEnrolementByStudent)

router.delete(
    "/delete/:id",
    moduleEnrolementByStudentController.deleteModuleEnrolementByStudent
);


router.post("/createbyadmin/:id", moduleEnrolementByStudentController.createModuleEnrolementByStudentByAdmin);

router.get("/all", moduleEnrolementByStudentController.getAllModuleEnrolementsByStudent);



module.exports = router




