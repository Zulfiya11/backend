const Groups = require("../models/groups");
const Group_enrolements = require("../models/group_enrolements");
const Group_student = require("../models/group_student");
const Lessons = require("../models/lessons");
const Group_lessons = require("../models/group_lessons");
const Group_days = require("../models/group_days");
const Modules = require("../models/modules");
const Courses = require("../models/courses");
const Users = require("../models/users");
const Rooms = require("../models/rooms");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { group } = require("console");

exports.createGroup = async (req, res) => {
    try {
        await Group_enrolements.query().update({
            status: "started",
        });
        const module = await Modules.query()
            .where("id", req.body.module_id)
            .first();
        const course = await Courses.query()
            .where("id", req.body.course_id)
            .first();
    
        const newGroup = await Groups.query().insert({
            name: req.body.name,
            teacher_id: req.body.teacher_id,
            assistant_id: req.body.assistant_id,
            starting_date: req.body.starting_date,
            course_id: req.body.course_id,
            module_id: req.body.module_id,
            time: req.body.time,
            room_id: req.body.room_id,
            starting_date: req.body.starting_date,
            status: "active",
        });
        const groupname = `${module.id}${course.name}${newGroup.id}`;
    
        await Groups.query().where("id", newGroup.id).update({
            name: groupname,
        });
    
        for (let i = 0; i < req.body.days.length; i++) {
            await Group_days.query().insert({
                group_id: newGroup.id,
                day_id: req.body.days[i].id,
            });
        }
    
        const lessons = await Lessons.query().where(
            "module_id",
            req.body.module_id
        );
        let status = 0;
    
        for (let i = 0; i < lessons.length; i++) {
            await Group_lessons.query().insert({
                lesson_id: lessons[i].id,
                group_id: newGroup.id,
                room_id: req.body.room_id,
                time: req.body.time,
                day_id: req.body.days[status].id,
            });
            status = (status + 1) % req.body.days.length;
        }
    
        for (let i = 0; i < req.body.students.length; i++) {
            const newGroupStudent = await Group_student.query().insert({
                group_id: newGroup.id,
                user_id: req.body.students[i].id,
            });
        }
        return res.status(201).json({ success: true, msg: "Group yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.id;
    
        const user = await Users.query().where("id", userId).first();
        if (user.role === "super") {
            const groups = await Groups.query()
                .join("rooms", "groups.room_id", "rooms.id")
                .join({ assistant: "users" }, "groups.assistant_id", "assistant.id")
                .join({ teacher: "users" }, "groups.teacher_id", "teacher.id")
                .select(
                    "groups.*",
                    "rooms.name as room_name",
                    "teacher.name as teacher_name",
                    "teacher.surname as teacher_surname",
                    "assistant.name as assistant_name",
                    "assistant.surname as assistant_surname"
                );
            return res.json({ success: true, groups });
        } else if (
            user.role === "head_teacher" ||
            user.role === "teacher" ||
            user.role === "assistant"
        ) {
            const groups = await Groups.query()
                .where("teacher_id", userId)
                .orWhere("assistant_id", userId)
                .join("rooms", "groups.room_id", "rooms.id")
                .join({ assistant: "users" }, "groups.assistant_id", "assistant.id")
                .join({ teacher: "users" }, "groups.teacher_id", "teacher.id")
                .select(
                    "groups.*",
                    "rooms.name as room_name",
                    "teacher.name as teacher_name",
                    "teacher.surname as teacher_surname",
                    "assistant.name as assistant_name",
                    "assistant.surname as assistant_surname"
                );
            return res.json({ success: true, groups });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editGroup = async (req, res) => {
    try {
        await Group_enrolements.query().where("id", req.params.id).update({
            name: req.body.name,
            teacher_id: req.body.teacher_id,
            assistant_id: req.body.assistant_id,
            starting_date: req.body.starting_date,
            course_id: req.body.course_id,
            module_id: req.body.module_id,
            day_id: req.body.day_id,
            time: req.body.time,
            room_id: req.body.room_id,
            starting_date: req.body.starting_date,
        });
        return res.status(200).json({ success: true, msg: "Group tahrirlandi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        await Group_days.query().where("group_id", req.params.id).delete();
        await Group_lessons.query().where("group_id", req.params.id).delete();
        await Group_student.query().where("group_id", req.params.id).delete();
    
        await Groups.query().where("id", req.params.id).delete();
    
        return res.status(200).json({ success: true, msg: "Group o'chirildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.finishGroup = async (req, res) => {
    try {
        await Groups.query().where("id", req.params.id).update({
            status: "finished",
        });
        return res.status(200).json({ success: true, msg: "Group tugatildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};