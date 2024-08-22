const router = require('express').Router()
const lessonReportTypesController = require('../controller/lessonReportTypesController')



router.post('/create', lessonReportTypesController.createLessonReportType)

router.get('/all/:id', lessonReportTypesController.getAllLessonReportTypes)

router.post('/edit/:id', lessonReportTypesController.editLessonReportType)

router.post('/delete/:id', lessonReportTypesController.deleteLessonReportType)



module.exports = router




