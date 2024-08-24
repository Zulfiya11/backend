const Assignment_types = require('../models/assignment_types')

exports.createAssignmentType = async(req, res) => {

   const newCourse = await Assignment_types.query().insert({
       name: req.body.name,
       weight: req.body.weight,
       module_id: req.body.module_id
    })
    return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
}

exports.getAllAssignmentTypes = async(req,res) => {
    const assignment_type = await Assignment_types.query().where('module_id', req.params.id)
    return res.json({success:true, assignments: assignment_type})
}

exports.editAssignmentType = async(req,res) => {
    await Assignment_types.query().where('id', req.params.id).update({
        name: req.body.name,
        weight: req.body.weight
    })
}

exports.deleteAssignmentType = async(req,res) => {
    await Assignment_types.query().where('id', req.params.id).delete()
}