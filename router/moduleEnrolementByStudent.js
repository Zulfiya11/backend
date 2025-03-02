const router = require('express').Router()
const moduleEnrolementByStudentController = require('../controller/moduleEnrolementByStudentController')




router.delete(
    "/delete/:id",
    moduleEnrolementByStudentController.deleteModuleEnrolementByStudent
);





module.exports = router




