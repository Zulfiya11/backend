const router = require('express').Router()
const lessonsController = require('../controller/lessonsController')



router.post('/create', lessonsController.createLesson)

router.get('/all/:id', lessonsController.getAllLessons)

router.post('/edit/:id', lessonsController.editLesson)

router.post('/delete/:id', lessonsController.deleteLesson)



module.exports = router




