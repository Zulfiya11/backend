const Assignment_types = require('../models/assignment_types')

exports.createAssignmentType = async(req, res) => {

   const newCourse = await Assignment_types.query().insert({
       name: req.body.name,
       weight: req.body.weight,
       module_id: req.body.module_id
    })
    return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
}

exports.getAllAssignmentTypes = async (req, res) => {
    const assignmentTypes = await Assignment_types.query()
        .where('assignment_types.module_id', req.params.id)
        .leftJoin('assignments', 'assignments.assignment_type_id', 'assignment_types.id')
        .groupBy('assignment_types.id')
        .select('assignment_types.*')
        .count('assignments.id as tests_total');

    return res.json({ success: true, assignmenttypes: assignmentTypes });
};

exports.editAssignmentType = async(req,res) => {
    await Assignment_types.query().where('id', req.params.id).update({
        name: req.body.name,
        weight: req.body.weight
    })
    return res.status(200).json({success:true, msg: "Assignment tpye tahrirlandi"})

}

exports.deleteAssignmentType = async(req,res) => {
    await Assignment_types.query().where('id', req.params.id).delete()
    return res.status(200).json({success:true, msg: "Assignment Type o'chirildi"})

}