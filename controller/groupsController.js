const Groups = require('../models/groups')
const Group_enrolements = require('../models/group_enrolements')
const Group_student = require('../models/group_student')
const Lessons = require('../models/lessons')
const Group_lessons = require('../models/group_lessons')
const { group } = require('console')



exports.createGroup = async(req, res) => {
    await Group_enrolements.query().update({
        status: "started"
    })
    const newGroup = await Groups.query().insert({
       name: req.body.name,
       teacher_id: req.body.teacher_id,
       assistant_id: req.body.assistant_id,
       starting_date: req.body.starting_date,
       course_id: req.body.course_id,
       module_id: req.body.module_id,
       days: req.body.days,
       time: req.body.time,
       room_id: req.body.room_id,
       starting_date: req.body.starting_date,
       status: "active"
    })

    const lessons = await Lessons.query().where('module_id', req.body.module_id)

    lessons.forEach(async element => {
        await Group_lessons.query().insert({
            lesson_id: element.id,
            group_id: newGroup.id
        })
    });

    req.body.students.forEach(async student => {
        await Group_student.query().insert({
               group_id: newGroup.id,
               user_id: student.id
        })
    });
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
            g.days,
            g.time,
            g.created
            g.status
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
  
    return res.json({ success: true, group_enrolements: data[0] });
};

exports.editGroup = async(req,res) => {
    await Group_enrolements.query().where('id', req.params.id).update({
        name: req.body.name,
        teacher_id: req.body.teacher_id,
        assistant_id: req.body.assistant_id,
        starting_date: req.body.starting_date,
        course_id: req.body.course_id,
        module_id: req.body.module_id,
        days: req.body.days,
        time: req.body.time,
        room_id: req.body.room_id,
        starting_date: req.body.starting_date
    })
    return res.status(200).json({success:true, msg: "Group Enrolement tahrirlandi"})
}

exports.deleteGroup = async(req,res) => {
    await Groups.query().where('id', req.params.id).delete()

    return res.status(200).json({success:true, msg: "Course o'chirildi"})
}

exports.finishGroup = async (req,res) => {
    await Groups.query().where('id', req.params.id).update({
        status: "finished"
    })
}