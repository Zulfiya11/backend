const Question_levels = require('../models/question_levels')
const Modules = require('../models/modules')


exports.createQuestionLevel = async(req, res) => {
    try {
        await Question_levels.query().insert({
           name: req.body.name,
           course_id: req.params.id
        })
            
         res.status(201).json({ success: true, msg: 'Question Level yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllQuestionLevels = async (req, res) => {
    try {
        const question_levels = await Question_levels.query().where(
            "course_id",
            req.params.id
        );
        return res.json({ success: true, question_levels: question_levels });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};
exports.editQuestionLevel = async(req,res) => {
    try {
        await Question_levels.query().where('id', req.params.id).update({
            name: req.body.name
        })
        return res.status(200).json({success:true, msg: "Question Level tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }

}

exports.deleteQuestionLevel = async(req,res) => {
    try {
        await Question_levels.query().where('id', req.params.id).delete()
    
        return res.status(200).json({success:true, msg: "Question Level o'chirildi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}