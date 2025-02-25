const Lesson_report_by_user = require("../models/lesson_report_by_user");
const Group_student = require("../models/group_student");
const Group_lessons = require("../models/group_lessons");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { group, log } = require("console");

exports.createLessonReportByUser = async (req, res) => {
    try {
         const authHeader = req.headers.authorization;
         if (!authHeader || !authHeader.startsWith("Bearer ")) {
             return res.status(401).json({
                 success: false,
                 message: "Unauthorized: Missing or invalid token",
             });
         }

         // Extract and verify the token
         const token = authHeader.split(" ")[1];
         const decodedToken = jwt.verify(token, secret);
         const studentId = decodedToken.id;
        const group_lesson_id = await Lesson_report_by_user.query()
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
            await Lesson_report_by_user.query().insert({
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

exports.getAllLessonReportByUser = async (req, res) => {
    try {
        let group_student = await Group_student.query()
            .where("group_id", req.params.id)
            .join("users", "group_student.user_id", "users.id") // Join users table
            .select("group_student.id AS id", "users.name AS student_name");

        let result = await Promise.all(
            group_student.map(async (e) => {
                let score = await Lesson_report_by_user.query()
                .where("group_student_id", e.id)
                    .andWhere(
                        "lesson_report_type_id",
                        req.body.lesson_report_type_id
                    )
                    .select("id", "score", "group_lesson_id"); // Include group_lesson_id in the query

                // Return the student object with score and group_lesson_id
                return {
                    ...e,
                    score: score.map((s) => ({
                        id: s.id,
                        score: s.score,
                        group_lesson_id: s.group_lesson_id, // Add group_lesson_id to the score object
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


exports.editLessonReportByUser = async (req, res) => {
    try {
        await Lesson_report_by_user.query().where("id", req.params.id).update({
            score: req.body.score,
        });
        return res
            .status(200)
            .json({ success: true, msg: "lesson report by user tahrirlandi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllLessonReportByUserByModuleByType = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing or invalid token",
            });
        }

        // Extract and verify the token
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        
        // Perform the join to fetch lesson reports and related lesson_report_type name
        const lesson_report_by_user = await Lesson_report_by_user.query()
            .join(
                "lesson_report_types",
                "lesson_report_by_user.lesson_report_type_id",
                "=",
                "lesson_report_types.id"
            )
            .join("lessons", "lesson_report_by_user.lesson_id", "lessons.id")
            .where("lesson_report_by_user.user_id", studentId)
            .andWhere("lesson_report_by_user.module_id", req.params.id)
        .select(
            "lesson_report_by_user.score",
            "lesson_report_types.name as lesson_report_type_name",
            "lessons.name as lesson_name"
        );
        
        return res.status(200).json({ success: true, data: lesson_report_by_user });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};



