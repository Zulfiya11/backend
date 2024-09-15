const router = require('express').Router()
const questionsController = require('../controller/questionsController.js')



router.post('/create', questionsController.createQuestion)

router.post('/all/:id', questionsController.getAllQuestions)

router.post('/edit/:id', questionsController.editQuestion)

router.post('/delete/:id', questionsController.deleteQuestion)


module.exports = router




