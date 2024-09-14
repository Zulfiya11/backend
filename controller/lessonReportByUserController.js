const Lesson_report_by_user = require('../models/lesson_report_by_user')
const Group_student = require('../models/group_student')
const Group_lessons = require('../models/group_lessons');
const { group } = require('console');

exports.createLessonReportByUser = async (req, res) => {
    const group_lesson_id = await Lesson_report_by_user.query().where('group_lesson_id', req.body.group_lesson_id).first()

    if (group_lesson_id) {
        return res.status(400).json({
            success: "false" ,
            msg: "Bunday Lesson Report By user ochilgan"
        })
    }
  
    for(let i = 0; i<req.body.students.length; i++) {

        await Lesson_report_by_user.query().insert({
            group_lesson_id: req.body.group_lesson_id,
            group_id: req.params.id,
            group_student_id: req.body.students[i].group_student_id,
            score: req.body.students[i].score,
            lesson_report_type_id: req.body.lesson_report_type_id
            })
        
    }
    return res.status(200).json({ success: true, msg: "Group Attendance yaratildi" });
};

exports.getAllLessonReportByUser = async (req, res) => {
    const group_lessons = await Group_lessons.query().where('group_id', req.params.id)
    let group_student = await Group_student.query()
    .where("group_id", req.params.id)
    .join('users', 'group_student.user_id', 'users.id') // Join users table
    .select(
        'group_student.id AS id', 
        'users.name AS student_name' 
    );    let result = await Promise.all(
        group_student.map(async (e) => {
            
            let score = await Lesson_report_by_user.query().where('lesson_report_type_id', req.body.lesson_report_type_id).andWhere(
                "group_student_id",
                e.id
            ).select('id', 'score')
            return {
                ...e,
                score: score,
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
