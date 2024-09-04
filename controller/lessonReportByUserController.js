const Lesson_report_by_user = require('../models/lesson_report_by_user')


exports.getAllLessonReportByUser = async(req,res) => {
    const lessonReportByUser = await Lesson_report_by_user.query().where('group_id', req.params.id)
    return res.json({success:true, lessonReportByUser: lessonReportByUser})
}

exports.editLessonReportByUser = async(req,res) => {
    await Lesson_report_by_user.query().where('id', req.params.id).update({
        score: req.body.score
    })
    return res.status(200).json({success:true, msg: "lesson report by user tahrirlandi"})

}