const Question_levels = require('../models/question_levels')
const Modules = require('../models/modules')


exports.createQuestionLevel = async(req, res) => {

    await Question_levels.query().insert({
       name: req.body.name,
       course_id: req.params.id
    })
        
     res.status(201).json({ success: true, msg: 'Question Level yaratildi' })
}

exports.getAllQuestionLevels = async (req, res) => {
    const module = await Modules.query().where('id', req.params.id).first()
    const question_levels = await Question_levels.query().where('course_id', module.course_id)
        
    return res.json({ success: true, question_levels: question_levels });
};

exports.editQuestionLevel = async(req,res) => {
    await Question_levels.query().where('id', req.params.id).update({
        name: req.body.name
    })
    return res.status(200).json({success:true, msg: "Question Level tahrirlandi"})

}

exports.deleteQuestionLevel = async(req,res) => {
    await Question_levels.query().where('id', req.params.id).delete()

    return res.status(200).json({success:true, msg: "Question Level o'chirildi"})
}