const Groups = require("../models/groups");
const Group_enrolements = require("../models/group_enrolements");
const Group_student = require("../models/group_student");
const Lessons = require("../models/lessons");
const Group_lessons = require("../models/group_lessons");
const Group_days = require("../models/group_days");
const Modules = require("../models/modules");
const Courses = require("../models/courses");



exports.createGroup = async(req, res) => {
    await Group_enrolements.query().update({
        status: "started"
    })
    const module = await Modules.query().where('id', req.body.module_id).first()
    const course = await Courses.query().where('id', req.body.course_id).first()

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
       status: "active"
    })
    const groupname = `${module.id}${course.name}${newGroup.id}`

    await Groups.query().where('id', newGroup.id).update({
        name: groupname
    })

    for(let i = 0 ; i < req.body.days.length; i++) {
        await Group_days.query().insert({
            group_id: newGroup.id,
            day_id: req.body.days[i].id
        })
    }

    const lessons = await Lessons.query().where('module_id', req.body.module_id)
    let status = 0

    for (let i = 0; i<lessons.length; i++) {

        await Group_lessons.query().insert({
            lesson_id: lessons[i].id,
            group_id: newGroup.id,
            room_id: req.body.room_id,
            time: req.body.time,
            day_id: req.body.days[status].id
        })
        status = (status+1)%req.body.days.length
    }

    for (let i = 0; i < req.body.students.length; i++) {
        const newGroupStudent = await Group_student.query().insert({
            group_id: newGroup.id,
            user_id: req.body.students[i].id
        })
    }
    return res.status(201).json({ success: true, msg: 'Group yaratildi' })
}

exports.getAllGroups = async (req, res) => {
  const knex = await Group_enrolements.knex();

  const data = await knex.raw(`
        SELECT
            g.id,
            g.name,
            CONCAT(t.name, ' ', t.surname) AS teacher_name,
            CONCAT(a.name, ' ', a.surname) AS assistant_name,
            c.name AS course_name,
            m.name AS module_name,
            r.name AS room_name,
            g.starting_date,
            g.time,
            g.created,
            g.status,
            m.id AS module_id
        FROM
            groups g
        JOIN
            rooms r ON g.room_id = r.id
        JOIN
            users t ON g.teacher_id = t.id
        JOIN
            users a ON g.assistant_id = a.id
        JOIN
            modules m ON g.module_id = m.id
        JOIN
            courses c ON g.course_id = c.id;`);

  return res.json({ success: true, groups: data[0] });
};

exports.editGroup = async (req, res) => {
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
};

exports.deleteGroup = async (req, res) => {
    await Group_days.query().where('group_id', req.params.id).delete()
    await Group_lessons.query().where('group_id', req.params.id).delete()
    await Group_student.query().where('group_id', req.params.id).delete()

  await Groups.query().where("id", req.params.id).delete();

  return res.status(200).json({ success: true, msg: "Group o'chirildi" });
};

exports.finishGroup = async (req, res) => {
  await Groups.query().where("id", req.params.id).update({
    status: "finished",
  });
  return res.status(200).json({ success: true, msg: "Group tugatildi" });
};