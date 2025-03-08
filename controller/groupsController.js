const Groups = require("../models/groups");
const Group_student = require("../models/group_student");
const Group_lessons = require("../models/group_lessons");
const Modules = require("../models/modules");
const Courses = require("../models/courses");
const Users = require("../models/users");
const Student_modules = require("../models/student_modules");
const Rooms = require("../models/rooms");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, msg: "Failed to authenticate token" });
        }
        req.user = decoded;
        next();
    });
};

exports.createGroup = [
    verifyToken,
    async (req, res) => {
        try {
            const module = await Modules.query()
                .where("id", req.body.module_id)
                .first();
            const course = await Courses.query()
                .where("id", req.body.course_id)
                .first();

            if (!module || !course) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        msg: "Invalid module or course ID",
                    });
            }

            const newGroup = await Groups.query().insert({
                teacher_id: req.body.teacher_id,
                assistant_id: req.body.assistant_id,
                starting_date: req.body.starting_date,
                course_id: req.body.course_id,
                module_id: req.body.module_id,
                room_id: req.body.room_id,
                status: "active",
            });



            const groupname = `${module.id}${course.name}${newGroup.id}`;

            await Groups.query()
                .where("id", newGroup.id)
                .update({ name: groupname });

            for (const student of req.body.students) {
                await Group_student.query().insert({
                    group_id: newGroup.id,
                    user_id: student.user_id,
                });

                await Student_modules.query()
                    .where("id", student.enrolement_id)
                    .update({
                    isGraduated: "studying",
                });
            }

            return res
                .status(201)
                .json({ success: true, msg: "Group created successfully" });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllGroups = [
    verifyToken,
    async (req, res) => {
        try {
            const groups = await Groups.query()
                .join("rooms", "groups.room_id", "rooms.id")
                .join(
                    { assistant: "users" },
                    "groups.assistant_id",
                    "assistant.id"
                )
                .join({ teacher: "users" }, "groups.teacher_id", "teacher.id")
                .join("modules", "groups.module_id", "modules.id")
                .join("courses", "groups.course_id", "courses.id")
                .select(
                    "groups.*",
                    "rooms.name as room_name",
                    "teacher.name as teacher_name",
                    "teacher.surname as teacher_surname",
                    "assistant.name as assistant_name",
                    "assistant.surname as assistant_surname",
                    "modules.name as module_name",
                    "courses.name as course_name"
                );

            return res.json({ success: true, groups });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllGroupsByTeacherOrAssistant = [
    verifyToken,
    async (req, res) => {
        try {
            const user = await Users.query().where("id", req.user.id).first();

            if (
                !user ||
                (user.role !== "teacher" && user.role !== "assistant")
            ) {
                return res
                    .status(403)
                    .json({ success: false, msg: "Access denied" });
            }

            const groups = await Groups.query()
                .where("teacher_id", req.user.id)
                .orWhere("assistant_id", req.user.id)
                .join("rooms", "groups.room_id", "rooms.id")
                .join(
                    { assistant: "users" },
                    "groups.assistant_id",
                    "assistant.id"
                )
                .join({ teacher: "users" }, "groups.teacher_id", "teacher.id")
                .join("modules", "groups.module_id", "modules.id")
                .join("courses", "groups.course_id", "courses.id")
                .select(
                    "groups.*",
                    "rooms.name as room_name",
                    "teacher.name as teacher_name",
                    "teacher.surname as teacher_surname",
                    "assistant.name as assistant_name",
                    "assistant.surname as assistant_surname",
                    "modules.name as module_name",
                    "courses.name as course_name"
                );

            return res.json({ success: true, groups });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];