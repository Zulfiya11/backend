const Lesson_report_types = require('../models/lesson_report_types')
const Lessons_report_types = require('../models/lesson_report_types')

exports.createLessonReportType = async(req, res) => {
    const lessonReportType = await Lessons_report_types.query().where('name', req.body.name).first()
    if (lessonReportType) {
        return res.status(400).json({ success: false, msg: 'Bunday lesson report type mavjud' })
    }

    await Lessons_report_types.query().insert({
       name: req.body.name,
       weight: req.body.weight,
       module_id: req.body.module_id,
       status: "active"
    })

    return res.status(201).json({ success: true, msg: 'Lesson report type yaratildi' })
}

exports.getAllLessonReportTypes = async(req,res) => {
    const lesson_report_type = await Lesson_report_types.query().where('module_id', req.params.id)
    return res.json({success:true, lesson_report_types: lesson_report_type})
}

exports.editLessonReportType = async(req,res) => {
    await Lesson_report_types.query().where('id', req.params.id).update({
        name: req.body.name,
        weight: req.body.weight,
    })
}

exports.deleteLessonReportType = async(req,res) => {
    await Lesson_report_types.query().where('id', req.params.id).update({
        status: "deleted"
    })
}