const router = require('express').Router()
const lessonReportByUserController = require('../controller/lessonReportByUserController')




router.get('/all/:id', lessonReportByUserController.getAllLessonReportByUser)

router.post('/edit/:id', lessonReportByUserController.editLessonReportByUser)



module.exports = router



