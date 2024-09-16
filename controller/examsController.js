const Exams = require('../models/exams')
const Assignment_levels = require('../models/assignment_levels')
const Questions = require('../models/questions')
const Options = require('../models/options')
const Group_student = require('../models/group_student')



exports.createExam = async (req, res) => {
    const assignment_level = await Assignment_levels.query().where('assignment_id', req.body.assignment_id);
    const group_student = await Group_student.query().where('group_id', req.params.id);

    for (let i = 0; i < group_student.length; i++) {
        for (let j = 0; j < assignment_level.length; j++) {
            let questions = await Questions.query().where('unit_id', assignment_level[j].unit_id).andWhere('level_id', assignment_level[j].level_id);
            
            for (let k = 0; k < assignment_level[j].quantity; k++) {
                if (questions.length === 0) {
                    break;
                }

                let random = Math.floor(Math.random() * (questions.length + 1));

                await Exams.query().insert({
                    question_id: questions[random].id,
                    assignment_id: req.body.assignment_id,
                    group_student_id: group_student[i].id,
                    when: req.body.when
                });

                questions.splice(random, 1);
            }
        }
    }
    return res.status(200).json({ msg: "zo'rsan" });
};


exports.getaAllExams = async(req,res) => {
    const questions = await Exams.query().where('group_student_id', req.params.id).andWhere('assignment_id', req.body.assignment_id)
    let result = await Promise.all(
        questions.map(async (e) => {
          let ans = await Options.query().where("question_id", e.question_id);
          return { ...e, options: ans };
        })
      );
      // console.log(result)
      return res.status(200).json({ success: true, data: result });

}