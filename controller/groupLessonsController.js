const Group_lessons = require('../models/group_lessons')


// exports.getAllGroupLessons = async(req,res) => {
//     const group_lessons = await Group_lessons.query().where('group_id', req.params.id)
  
//     return res.json({ success: true, group_lessons: group_lessons });
// }

exports.getAllGroupLessons = async(req,res) => {
    const knex = await Group_lessons.knex();

    const data = await knex.raw(`
        SELECT
            gl.id,
            l.name AS lesson_name,
            l.id AS lesson_id,
            r.name AS room_name,
            r.id AS room_id,
            gl.time,
            d.name AS day_name,
            d.id AS day_id,
            gl.group_id,
            gl.room_id,
            gl.created
        FROM
            group_lessons gl
        JOIN
            lessons l ON gl.lesson_id = l.id
        JOIN
            rooms r ON gl.room_id = r.id
        JOIN
            days d ON gl.day_id = d.id
        WHERE
            gl.group_id = ?;`, [req.params.id]);
  
    return res.json({ success: true, group_lessons: data[0] });

}

exports.editGroupLesson = async(req, res) => {
    await Group_lessons.query().where('id', req.params.id).update({
       when: req.body.when
    })

    return res.status(201).json({ success: true, msg: 'Group Lesson tahrirlandi' })
}