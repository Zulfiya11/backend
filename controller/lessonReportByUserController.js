const Lesson_report_by_user = require('../models/lesson_report_by_user')
const Lesson_report_by_user = require('../models/lesson_report_by_user')

exports.createLessonReportByUser = async(req, res) => {
    
    await Lesson_report_by_user.query().insert({
       name: req.body.name,
       module_id: req.body.module_id,
    })
    return res.status(201).json({ success: true, msg: 'Lesson yaratildi' })
}

exports.getAllLessons = async(req,res) => {
    const group_student = await Gr.query().where('module_id', req.params.id)
    return res.json({success:true, lessons: lesson})
}

exports.editLesson = async(req,res) => {
    await Lessons.query().where('id', req.params.id).update({
        name: req.body.name
    })
    return res.status(200).json({success:true, msg: "Lesson tahrirlandi"})

}