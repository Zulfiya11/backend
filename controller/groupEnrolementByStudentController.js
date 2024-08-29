const Group_enrolement_by_student = require('../models/group_enrolement_by_student')

exports.createGroupEnrolementByStudent = async(req, res) => {
    await Group_enrolement_by_student.query().insert({
       user_id: req.body.user_id,
       group_enrolement_id: req.body.group_enrolement_id
    })

    return res.status(201).json({ success: true, msg: 'Group Enrolement by Student yaratildi' })
}

exports.getaAllGroupEnrolementByStudent = async(req,res) => {
    const knex = await Group_enrolement_by_student.knex();

    const data = await knex.raw(`
        SELECT
            ges.id,
            CONCAT(u.name, ' ', u.surname) AS student_name,
            ges.group_enrolement_id,
            ges.created
        FROM
            group_enrolement_by_student ges
        JOIN
            users u ON ges.user_id = u.id;`);
  
    return res.json({ success: true, group_enrolement_by_student: data[0] });

}

exports.deleteGroupEnrolementByStudent = async(req,res) => {
    await Group_enrolement_by_student.query().where('id', req.params.id).delete()
  
    return res.status(200).json({success:true, msg: "Group Enrolement By Student o'chirildi"})
}