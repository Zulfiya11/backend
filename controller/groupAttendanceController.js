const Group_attendance = require('../models/group_attendance')
const Group_student = require('../models/group_student')



exports.getAllGroupAttendance = async (req, res) => {
    const group_attendance = await Group_attendance.query().where('group_id', req.params.id)
    let group_student = await Group_student.query()
    .where("group_id", req.params.id)
    .join('users', 'group_student.user_id', 'users.id')
    .select(
        'group_student.id AS id',
        'users.name AS student_name'
    );  
    let result = await Promise.all(
        group_student.map(async (e) => {
            
            let attendance = await Group_attendance.query().where(
                "group_student_id",
                e.id
            ).select('id', 'isAttended')
            return {
                ...e,
                attendance: attendance,
            };
        })
    );

    return res.status(200).json({ success: true, data: result });
};

exports.editLessonReportByUser = async(req,res) => {
    await Lesson_report_by_user.query().where('id', req.params.id).update({
        score: req.body.score
    })
    return res.status(200).json({success:true, msg: "lesson report by user tahrirlandi"})

}
