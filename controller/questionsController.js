const questions = require('../models/questions');

exports.createQuestion = async(req, res) => {
    const question = await Questions.query().where('question', req.body.question).first()
    if (question) {
        return res.status(400).json({ success: false, msg: 'Bunday savol mavjud' })
    }

    await Courses.query().insert({
       name: req.body.name
    })

    return res.status(201).json({ success: true, msg: 'Savol yaratildi' })
}