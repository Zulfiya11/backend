const Exams = require('../models/exams')
const Assignment_levels = require('../models/assignment_levels')
const Questions = require('../models/questions')
const Options = require('../models/options')
const Group_student = require('../models/group_student')
const Assignments_by_groupstudent = require('../models/assignments_by_groupstudent')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')
const { group } = require('console')



exports.createExam = async (req, res) => {
    
    const group_student = await Group_student.query().where('group_id', req.params.id);


    const assignment_level = await Assignment_levels.query().where('assignment_id', req.body.assignment_id);
    for (let i = 0; i < group_student.length; i++) {
        const user_id = await Group_student.query().where('id', group_student[i].id).first()
        const newAssignmentByStudent = await Assignments_by_groupstudent.query().insert({
            group_student_id: group_student[i].id,
            assignment_id: req.body.assignment_id,
            user_id: user_id.user_id,
            status: 'not completed'
        })
        for (let j = 0; j < assignment_level.length; j++) {
            let questions = await Questions.query().where('unit_id', assignment_level[j].unit_id).andWhere('level_id', assignment_level[j].level_id);
            
            for (let k = 0; k < assignment_level[j].quantity; k++) {
                if (questions.length === 0) {
                    break;
                }

                let random = Math.floor(Math.random() * (questions.length));

                await Exams.query().insert({
                    question_id: questions[random].id,
                    assignment_id: req.body.assignment_id,
                    group_student_id: group_student[i].id,
                    when: req.body.when,
                    user_id: user_id.user_id,
                    assignments_by_groupstudent_id: newAssignmentByStudent.id,
                    group_id: req.params.id 
                });

                questions.splice(random, 1);
            }
        }
    }
    return res.status(200).json({ msg: "zo'rsan" });
};

exports.getaAllExamsByStudent = async(req,res) => {
    const decodedToken = jwt.verify(token, {secret});
    const studentId = decodedToken.id;
    const exams = await Assignments_by_groupstudent.query().where('user_id', studentId)

    return res.status(200).json({success: true, exams: exams})
}


exports.getaAllQuestionsByExam = async(req,res) => {
    const questions = await Exams.query().where('group_student_id', req.params.id).andWhere('assignment_id', req.body.assignment_id)
    let result = await Promise.all(
        questions.map(async (e) => {
          let ans = await Options.query().where("question_id", e.question_id);
          return { ...e, options: ans };
        })
      );
      
      return res.status(200).json({ success: true, data: result });

}