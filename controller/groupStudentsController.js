const Group_student = require('../models/group_student')

exports.createGroupStudent = async(req, res) => {
    await Group_student.query().insert({
       user_id: req.body.user_id,
       group_id: req.params.id
    })

    return res.status(201).json({ success: true, msg: 'Group Student yaratildi' })
}

exports.getAllGroupStudents = async(req,res) => {
    const knex = await Group_student.knex();

    const data = await knex.raw(`
        SELECT
            gs.id,
            CONCAT(u.name, ' ', u.surname) AS student_name,
            gs.group_id,
            gs.created,
            u.id AS student_id
        FROM
            group_student gs
        JOIN
            users u ON gs.user_id = u.id
        WHERE
            gs.group_id = ?;`, [req.params.id]);
  
    return res.json({ success: true, group_student: data[0] });

}

exports.deleteGroupStudent = async(req,res) => {
    await Group_student.query().where('id', req.params.id).delete()
  
    return res.status(200).json({success:true, msg: "Group Student o'chirildi"})
}   