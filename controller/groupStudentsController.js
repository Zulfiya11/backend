const Group_student = require('../models/group_student')

exports.createGroupStudent = async(req, res) => {
    await Group_student.query().insert({
       user_id: req.body.user_id,
       group_id: req.body.group_id
    })

    return res.status(201).json({ success: true, msg: 'Group Student yaratildi' })
}

exports.getAllGroupStudents = async(req,res) => {
    const group_students = await Group_student.query().select('*').where('group_id', req.params.id)
  
    return res.json({ success: true, group_students: group_students });
}

exports.deleteGroupStudent = async(req,res) => {
    await Group_student.query().where('id', req.params.id).delete()
  
    return res.status(200).json({success:true, msg: "Group Student o'chirildi"})
}