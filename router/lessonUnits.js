const router = require('express').Router()
const lessonUnitsController = require('../controller/lessonUnitsController')



router.post('/create', lessonUnitsController.createLessonUnit)

router.get('/all/:id', lessonUnitsController.getAllLessonUnits)

router.post('/edit/:id', lessonUnitsController.editLessonUnit)

router.post('/delete/:id', lessonUnitsController.deleteLessonUnit)



module.exports = router




