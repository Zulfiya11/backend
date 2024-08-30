const router = require('express').Router()
const groupLessonsController = require('../controller/groupLessonsController')




router.get('/all/:id', groupLessonsController.getAllGroupLessons)

router.post('/edit/:id', groupLessonsController.editGroupLesson)



module.exports = router




