const Exams = require("../models/exams");
const Assignment_levels = require("../models/assignment_levels");
const Assignments = require("../models/assignments");
const Questions = require("../models/questions");
const Options = require("../models/options");
const Group_student = require("../models/group_student");
const Assignments_by_groupstudent = require("../models/assignments_by_groupstudent");
const Assignments_by_group = require("../models/assignments_by_group");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { group } = require("console");

exports.createExam = async (req, res) => {
    try {
        const assignments = await Assignments.query().where(
            "id",
            req.body.assignment_id
        ).first();
    
        await Assignments_by_group.query().insert({
            group_id: req.params.id,
            assignment_id: req.body.assignment_id,
            when: req.body.when,
            assignment_type_id: assignments.assignment_type_id
        });
        
        
        const group_student = await Group_student.query().where(
            "group_id",
            req.params.id
        );
    
        const assignment_level = await Assignment_levels.query().where(
            "assignment_id",
            req.body.assignment_id
        );
        for (let i = 0; i < group_student.length; i++) {
            const user_id = await Group_student.query()
                .where("id", group_student[i].id)
                .first();
            const newAssignmentByStudent =
                await Assignments_by_groupstudent.query().insert({
                    group_student_id: group_student[i].id,
                    assignment_id: req.body.assignment_id,
                    user_id: user_id.user_id,
                    group_id: req.params.id,
                    status: "not completed",
                });
            for (let j = 0; j < assignment_level.length; j++) {
                let questions = await Questions.query()
                    .where("unit_id", assignment_level[j].unit_id)
                    .andWhere("level_id", assignment_level[j].level_id);
    
                for (let k = 0; k < assignment_level[j].quantity; k++) {
                    if (questions.length === 0) {
                        break;
                    }
    
                    let random = Math.floor(Math.random() * questions.length);
    
                    await Exams.query().insert({
                        question_id: questions[random].id,
                        assignment_id: req.body.assignment_id,
                        group_student_id: group_student[i].id,
                        when: req.body.when,
                        user_id: user_id.user_id,
                        assignment_by_groupstudent_id: newAssignmentByStudent.id,
                        group_id: req.params.id,
                    });
    
                    questions.splice(random, 1);
                }
            }
        }
        return res.status(200).json({ msg: "zo'rsan" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllExamsByGroup = async (req, res) => {
    try {
        const exams = await Assignments_by_group.query()
            .where("group_id", req.params.id)
            .andWhere("assignments_by_group.assignment_type_id", req.body.assignment_type_id)
            .join(
                "assignments",
                "assignments_by_group.assignment_id",
                "assignments.id"
            )
            .join("groups", "assignments_by_group.group_id", "groups.id")
            .select(
                "assignments_by_group.*",
                "groups.name as group_name",
                "assignments.name as assignment_name"
            );
        return res.status(200).json({ success: true, exams: exams });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllExamsResultsForGroup = async (req, res) => {
    try {
        const results = await Assignments_by_groupstudent.query()
            .where("group_id", req.params.id)
            .andWhere("assignment_id", req.body.assignment_id)
            .join(
                "users",
                "assignments_by_groupstudent.user_id",
                "users.id"
            )
            .select(
                "assignments_by_groupstudent.*",
                "users.name as user_name",
                "users.surname as user_surname"
            );
        return res.status(200).json({ success: true, exams: results });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllExamsByStudent = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
        const exams = await Assignments_by_groupstudent.query()
            .where("user_id", studentId)
            .andWhere('assignments_by_groupstudent.status', "not completed")
            .join(
                "assignments",
                "assignments_by_groupstudent.assignment_id",
                "assignments.id"
            )
            .join("groups", "assignments_by_groupstudent.group_id", "groups.id")
            .select(
                "assignments_by_groupstudent.*",
                "groups.name as group_name",
                "assignments.name as assignment_name"
            );
        return res.status(200).json({ success: true, exams: exams });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllQuestionsByExam = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
        const questions = await Exams.query()
            .where("user_id", studentId)
            .andWhere(
                "assignment_by_groupstudent_id",
                req.body.assignment_by_groupstudent_id
            )
            .join("questions", "exams.question_id", "questions.id")
            .select("exams.*", "questions.question as question");
        let result = await Promise.all(
            questions.map(async (e) => {
                let ans = await Options.query().where("question_id", e.question_id);
                return { ...e, options: ans };
            })
        );
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.answers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
        let countTrue = 0
        const exam = await Assignments_by_groupstudent.query().where('user_id', studentId).andWhere('id', req.body.assignment_by_groupstudent_id).first()
    
        if (exam.status === "not completed") {
            for (let i = 0; i < req.body.answers.length; i++) {
                await Exams.query()
                    .where("user_id", studentId)
                    .andWhere(
                        "assignment_by_groupstudent_id",
                        req.body.assignment_by_groupstudent_id
                    )
                    .andWhere("question_id", req.body.answers[i].question_id)
                    .update({
                        answer: req.body.answers[i].answer,
                    });
                const trueAnswer = await Options.query()
                    .where("question_id", req.body.answers[i].question_id)
                    .andWhere("isRight", "right")
                    .select("option")
                    .first();
                if (req.body.answers[i].answer === trueAnswer.option) {
                    await Exams.query()
                        .where("user_id", studentId)
                        .andWhere(
                            "assignment_by_groupstudent_id",
                            req.body.assignment_by_groupstudent_id
                        )
                        .andWhere("question_id", req.body.answers[i].question_id)
                        .update({
                            isTrue: 1,
                        });
                    countTrue++
                } else {
                    await Exams.query()
                        .where("user_id", studentId)
                        .andWhere(
                            "assignment_by_groupstudent_id",
                            req.body.assignment_by_groupstudent_id
                        )
                        .andWhere("question_id", req.body.answers[i].question_id)
                        .update({
                            isTrue: 0,
                        });
                }
            }
        
    
            const result = countTrue / req.body.answers.length
            await Assignments_by_groupstudent.query()
                .where("user_id", studentId)
                .andWhere(
                    "id", req.body.assignment_by_groupstudent_id).update({
                        result: result,
                        status: "completed"
                    })
        
                    return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, msg: "Already completed" }); 
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};