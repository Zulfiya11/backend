const router = require('express').Router()
const lessonReportByUserController = require('../controller/lessonReportByUserController')



router.post('/create/:id', lessonReportByUserController.createLessonReportByUser)

router.post('/all/:id', lessonReportByUserController.getAllLessonReportByUser)

router.post('/edit/:id', lessonReportByUserController.editLessonReportByUser)

router.get("/allbyuserbymodule/:id", lessonReportByUserController.getAllLessonReportByUserByModuleByType);


module.exports = router




