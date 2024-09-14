const router = require('express').Router()
const questionLevelsController = require('../controller/questionLevelsController.js')



router.post('/create/:id', questionLevelsController.createQuestionLevel)

router.get('/all/:id', questionLevelsController.getAllQuestionLevels)

router.post('/edit/:id', questionLevelsController.editQuestionLevel)

router.post('/delete/:id', questionLevelsController.deleteQuestionLevel)


module.exports = router




