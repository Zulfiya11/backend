const Questions = require('../models/questions')
const Options = require('../models/options')


exports.createQuestion = async(req, res) => {

    const newQuestion = await Questions.query().insert({
       question: req.body.question,
       level: req.body.level,
       unit_id: req.body.unit_id,

    })
    await Options.query().insert({
        option: req.body.first,
        isRight: "right",
        question_id: newQuestion.id,
    })
    await Options.query().insert({
        option: req.body.first,
        isRight: "wrong",
        question_id: newQuestion.id,
    })
    await Options.query().insert({
        option: req.body.first,
        isRight: "wrong",
        question_id: newQuestion.id,
    })
    await Options.query().insert({
        option: req.body.first,
        isRight: "wrong",
        question_id: newQuestion.id,
    })
        
     res.status(201).json({ success: true, msg: 'Question yaratildi' })
}

exports.getAllQuestions = async(req,res) => {
   
    const question = await Questions.query().where('unit_id', req.params.id)

    return res.json({success:true, questions: question})
}

exports.editQuestion = async(req,res) => {

    const newQuestion = await Questions.query().insert({
        question: req.body.question,
        level: req.body.level,
        unit_id: req.body.unit_id,
 
     })
     await Options.query().insert({
         option: req.body.first,
         isRight: "right",
         question_id: newQuestion.id,
     })
     await Options.query().insert({
         option: req.body.first,
         isRight: "wrong",
         question_id: newQuestion.id,
     })
     await Options.query().insert({
         option: req.body.first,
         isRight: "wrong",
         question_id: newQuestion.id,
     })
     await Options.query().insert({
         option: req.body.first,
         isRight: "wrong",
         question_id: newQuestion.id,
     })


    return res.status(200).json({success:true, msg: "Module tahrirlandi"})

}

exports.deleteQuestion = async(req,res) => {

    await Questions.query().where('id', req.params.id).delete()
    await Options.query().where('question_id', req.params.id).delete()

    return res.status(200).json({success:true, msg: "Question o'chirildi"})

}