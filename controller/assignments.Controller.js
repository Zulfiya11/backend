const Assignments = require('../models/assignments')

exports.createAssignment = async(req, res) => {

   const newCourse = await Assignments.query().insert({
       name: req.body.name,
       module_id: req.body.module_id,
       assignment_type_id: req.body.assignment_type_id
    })
    return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
}

exports.getAllAssignments = async(req,res) => {
    const assignment = await Assignments.query().where('module_id', req.params.id)
    return res.json({success:true, assignments: assignment})
}

exports.editAssignment = async(req,res) => {
    await Assignments.query().where('id', req.params.id).update({
        name: req.body.name,
    })
}

exports.deleteAssignment = async(req,res) => {
    await Assignments.query().where('id', req.params.id).delete()
}