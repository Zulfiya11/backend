const Lesson_report_by_user = require('../models/lesson_report_by_user')
const Group_student = require('../models/group_student')
const Lesson_report_types = require('../models/lesson_report_types')
const Group_lessons = require('../models/group_lessons');
const { group } = require('console');


exports.getAllLessonReportByUser = async (req, res) => {
    let group_student = await Group_student.query()
    .where("group_id", req.params.id)
    .join('users', 'group_student.user_id', 'users.id') // Join users table
    .select(
        'group_student.id AS id', // Select group_student id
        'users.name AS student_name' // Select name from users table
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


exports.getAllLessonReportByUserByLesson = async (req, res) => {
    let group_student = await Group_student.query()
    .where("group_id", req.params.id)
    .join('users', 'group_student.user_id', 'users.id') // Join users table
    .select(
        'group_student.id AS id', // Select group_student id
        'users.name AS student_name' // Select name from users table
    );    let result = await Promise.all(
        group_student.map(async (e) => {
            
            let score = await Lesson_report_by_user.query().where('lesson_report_type_id', req.body.lesson_report_type_id).andWhere('group_lesson_id', req.body.group_lesson_id).andWhere(
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
