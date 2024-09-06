const router = require('express').Router()
const lessonReportByUserController = require('../controller/lessonReportByUserController')




router.post('/all/:id', lessonReportByUserController.getAllLessonReportByUser)

router.post('/all/bylesson/:id', lessonReportByUserController.getAllLessonReportByUserByLesson)

router.post('/edit/:id', lessonReportByUserController.editLessonReportByUser)



module.exports = router




