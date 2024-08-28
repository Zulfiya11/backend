const Group_enrolements = require('../models/group_enrolements')

exports.createGroupEnrolement = async(req, res) => {

    await Group_enrolements.query().insert({
       name: req.body.name,
       teacher_id: req.body.teacher_id,
       assistant_id: req.body.assistant_id,
       starting_date: req.body.starting_date,
       module_id: req.body.module_id,
       days: req.body.days,
       time: req.body.time,
       room_id: req.body.room_id
    })

    return res.status(201).json({ success: true, msg: 'Group Enrolement yaratildi' })
}

exports.getaAllGroupEnrolements = async(req,res) => {
    const group_enrolement = await Group_enrolements.query().select('*')
    return res.json({success:true, group_enrolements: group_enrolement})
}

exports.editGroupEnrolement = async(req,res) => {
    await Group_enrolements.query().where('id', req.params.id).update({
        name: req.body.name,
        teacher_id: req.body.teacher_id,
        assistant_id: req.body.assistant_id,
        starting_date: req.body.starting_date,
        module_id: req.body.module_id,
        days: req.body.days,
        time: req.body.time,        room_id: req.body.room_id
    })
    return res.status(200).json({success:true, msg: "Group Enrolement tahrirlandi"})
}

exports.deleteGroupEnrolement = async(req,res) => {
    await Group_enrolements.query().where('id', req.params.id).delete()

    return res.status(200).json({success:true, msg: "Course o'chirildi"})

}