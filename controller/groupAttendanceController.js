const Group_attendance = require('../models/group_attendance')
const Group_student = require('../models/group_student')
const Groups = require('../models/groups')


exports.createGroupAttendance = async (req, res) => {
    try {
        const group = await Groups.query().where('id', req.params.id).first()
        const group_lesson_id = await Group_attendance.query().where('group_lesson_id', req.body.group_lesson_id).first()
    
        if (group_lesson_id) {
            return res.status(400).json({
                success: "false" ,
                msg: "Bunday guruh lesson ochilgan"
            })
        }
      
        for(let i = 0; i<req.body.students.length; i++) {
    
            await Group_attendance.query().insert({
                group_lesson_id: req.body.group_lesson_id,
                group_id: req.params.id,
                module_id: group.module_id,
                group_student_id: req.body.students[i].group_student_id,
                isAttended: req.body.students[i].isAttended,
                comment: req.body.students[i].comment
                })
            
        }
        return res.status(200).json({ success: true, msg: "Group Attendance yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllGroupAttendance = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editLessonReportByUser = async(req,res) => {
    try {
        await Lesson_report_by_user.query().where('id', req.params.id).update({
            score: req.body.score
        })
        return res.status(200).json({success:true, msg: "lesson report by user tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}