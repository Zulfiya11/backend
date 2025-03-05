const Group_attendance = require('../models/group_attendance')
const Group_student = require('../models/group_student')
const Group_lessons = require("../models/group_lessons");
const Groups = require('../models/groups')
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req) => {
    const token = req.headers.authorization;
    if (!token) throw new Error("Token required");

    try {
        return jwt.verify(token.split(" ")[1], secret);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

exports.createGroupAttendance = async (req, res) => {
    try {
        verifyToken(req);
        const group = await Groups.query().where('id', req.params.id).first()

    
        const group_lesson = await Group_lessons.query().insert({
            group_id: req.params.id,
            lesson_id: req.body.lesson_id,
            lesson_date: req.body.lesson_date,
            room_id: req.body.room_id
        });
      
        for(let i = 0; i < req.body.students.length; i++) {
    
            await Group_attendance.query().insert({
                lesson_id: req.body.lesson_id,
                group_lesson_id: group_lesson.id,
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
        verifyToken(req);

        let group_student = await Group_student.query()
            .where("group_student.group_id", req.params.id)
            .join("users", "group_student.user_id", "users.id")
            .leftJoin(
                "group_attendance",
                "group_student.id",
                "group_attendance.group_student_id"
            )
            .leftJoin("lessons", "group_attendance.lesson_id", "lessons.id")
            .select(
                "group_student.id AS id",
                "users.name AS student_name",
                "group_attendance.id AS attendance_id",
                "group_attendance.isAttended",
                "group_attendance.group_lesson_id",
                "lessons.name AS lesson_name"
            );

        // Group attendance records by student
        let result = group_student.reduce((acc, student) => {
            let existing = acc.find((s) => s.id === student.id);

            let attendanceRecord = {
                id: student.attendance_id,
                isAttended: student.isAttended,
                group_lesson_id: student.group_lesson_id,
                lesson_name: student.lesson_name,
            };

            if (existing) {
                existing.attendance.push(attendanceRecord);
            } else {
                acc.push({
                    id: student.id,
                    student_name: student.student_name,
                    attendance: student.attendance_id ? [attendanceRecord] : [],
                });
            }

            return acc;
        }, []);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllGroupAttendanceByLesson = async (req, res) => {
    try {
        verifyToken(req);

        const group_attendance = await Group_attendance.query()
            .where("group_lesson_id", req.params.id)
            .join(
                "group_student",
                "group_attendance.group_student_id",
                "group_student.id"
            )
            .join("users", "group_student.user_id", "users.id")
            .join("lessons", "group_attendance.lesson_id", "lessons.id")
            .join(
                "group_lessons",
                "group_attendance.group_lesson_id",
                "group_lessons.id"
            )
            .join("rooms", "group_lessons.room_id", "rooms.id") // Assuming room info is in 'rooms' table
            .select(
                "group_attendance.id AS id",
                Group_attendance.raw(
                    "CONCAT(users.name, ' ', users.surname) AS student_name"
                ),
                "group_attendance.isAttended",
                "group_attendance.comment",
                "lessons.name AS lesson_name",
                "rooms.name AS room_name", // Fetch room_name instead of room_id
                "group_lessons.lesson_date"
            );

        if (group_attendance.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No attendance records found.",
            });
        }

        // Extract lesson details
        const lesson_info = {
            lesson_name: group_attendance[0].lesson_name,
            room_name: group_attendance[0].room_name,
            lesson_date: group_attendance[0].lesson_date,
        };

        // Format student attendance array
        const student_attendance = group_attendance.map(
            ({ id, student_name, isAttended, comment }) => ({
                id,
                student_name,
                isAttended,
                comment,
            })
        );

        return res.status(200).json({
            success: true,
            data: {
                lesson_info,
                student_attendance,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};



