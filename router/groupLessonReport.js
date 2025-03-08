const router = require('express').Router()
const groupLessonReportController = require('../controller/groupLessonReportController')



router.post('/create/:id', groupLessonReportController.createGroupLessonReport)

router.post('/all/:id', groupLessonReportController.getAllGroupLessonReports)

router.post("/all/bylesson/:id", groupLessonReportController.getAllGroupLessonReportsByLesson);

router.post('/edit', groupLessonReportController.editGroupLessonReport)

router.get("/allbyuserbymodule/:id", groupLessonReportController.getAllGroupLessonReportsByModuleByType);


module.exports = router




