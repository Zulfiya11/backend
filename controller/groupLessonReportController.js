const Group_lesson_report = require("../models/group_lesson_report");
const Group_student = require("../models/group_student");
const Group_lessons = require("../models/group_lessons");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { group, log } = require("console");
const Lessons = require("../models/lessons");

const verifyToken = (req) => {
    const token = req.headers.authorization;
    if (!token) throw new Error("Token required");

    try {
        return jwt.verify(token.split(" ")[1], secret);
    } catch (error) {
        throw new Error("Invalid token");
    }
};
exports.createGroupLessonReport = async (req, res) => {
    try {
        verifyToken(req);

         // Extract and verify the token
        const group_lesson_id = await Group_lesson_report.query()
            .where("group_lesson_id", req.body.group_lesson_id)
            .andWhere('lesson_report_type_id', req.body.lesson_report_type_id)
            .first();

        if (group_lesson_id) {
            return res.status(400).json({
                success: "false",
                msg: "Bunday Lesson Report By user ochilgan",
            });
        }
        const group_lessons = await Group_lessons.query().where("id", req.body.group_lesson_id).first();
        
        for (let i = 0; i < req.body.students.length; i++) {
            await Group_lesson_report.query().insert({
                group_lesson_id: req.body.group_lesson_id,
                lesson_id: group_lessons.lesson_id,
                group_id: req.params.id,
                group_student_id: req.body.students[i].group_student_id,
                score: req.body.students[i].score,
                lesson_report_type_id: req.body.lesson_report_type_id,
                module_id: req.body.module_id,
                user_id: req.body.students[i].user_id
            });
        }
        return res
            .status(200)
            .json({ success: true, msg: "Group Attendance yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllGroupLessonReports = async (req, res) => {
    try {
        verifyToken(req);
        let group_student = await Group_student.query()
            .where("group_id", req.params.id)
            .join("users", "group_student.user_id", "users.id") // Join users table
            .select("group_student.id AS id", 
                Group_student.raw("CONCAT(users.name, ' ', users.surname) AS student_name")
            );

        let result = await Promise.all(
            group_student.map(async (e) => {
                let score = await Group_lesson_report.query()
                    .where("group_student_id", e.id)
                    .andWhere(
                        "lesson_report_type_id",
                        req.body.lesson_report_type_id
                    )
                    .join(
                        "lessons",
                        "group_lesson_report.lesson_id",
                        "lessons.id"
                    ) // Join lessons table
                    .select(
                        "group_lesson_report.id",
                        "group_lesson_report.score",
                        "group_lesson_report.group_lesson_id",
                        "group_lesson_report.lesson_id",
                        "lessons.name AS lesson_name"
                    ); // Select lesson name

                // Return the student object with score, group_lesson_id, and lesson_name
                return {
                    ...e,
                    score: score.map((s) => ({
                        id: s.id,
                        score: s.score,
                        group_lesson_id: s.group_lesson_id,
                        lesson_id: s.lesson_id, // Include lesson_id
                        lesson_name: s.lesson_name, // Include lesson name
                    })),
                };
            })
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllGroupLessonReportsByLesson = async (req, res) => {
    try {
        verifyToken(req);
        
        const group_lesson_report = await Group_lesson_report.query()
            .where("group_lesson_id", req.params.id)
            .andWhere("lesson_report_type_id", req.body.lesson_report_type_id)
            .join("users", "group_lesson_report.user_id", "users.id") // Join users table
            .select(
                "group_lesson_report.id AS id",
                "group_lesson_report.score AS score",
                "users.name AS student_name"
        )
        
        const lesson = await Lessons.query().where("id", req.body.lesson_id).first();

        return res.status(200).json({ success: true, group_lesson_report: group_lesson_report, lesson_name: lesson.name });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: error.message });
    }
}

exports.editGroupLessonReport = async (req, res) => {
    try {
        for (let i = 0; i < req.body.group_lesson_report.length; i++) {
            await Group_lesson_report.query()
                .where("id", req.body.group_lesson_report[i].id)
                .update({
                    score: req.body.group_lesson_report[i].score,
                });
        }
        return res
            .status(200)
            .json({ success: true, msg: "lesson report by user tahrirlandi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllGroupLessonReportsByGroupStudent = async (req, res) => {
    try {
        verifyToken(req);

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;
       
        const group_lesson_reports = await Group_lesson_report.query()
            .where("group_lesson_report.user_id", studentId)
            .andWhere("group_lesson_report.group_id", req.params.id)
            .andWhere("group_lesson_report.lesson_report_type_id", req.body.lesson_report_type_id)
            .join(
                "lesson_report_types",
                "group_lesson_report.lesson_report_type_id",
                "lesson_report_types.id"
            )
            .join("lessons", "group_lesson_report.lesson_id", "lessons.id")
        .select(
            "group_lesson_report.*",
            "lesson_report_types.name as lesson_report_type_name",
            "lessons.name as lesson_name"
        );
        
        console.log("user_id:", studentId, "group_id:", req.params.id, "lesson_report_type_id:", req.body.lesson_report_type_id);
        return res.status(200).json({ success: true, group_lesson_reports: group_lesson_reports });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};



