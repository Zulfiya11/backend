const Assignments = require('../models/assignments')

exports.createAssignment = async(req, res) => {

   const newCourse = await Assignments.query().insert({
       name: req.body.name,
       module_id: req.body.module_id,
       assignment_type_id: req.body.assignment_type_id
    })
    return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
}

exports.getAllAssignments = async (req, res) => {
    const assignments = await Assignments.query()
        .where('assignment_type_id', req.params.id)
        .select('assignments.*')
        .join('assignment_types', 'assignments.assignment_type_id', 'assignment_types.id')
        .select(
            Assignments.raw('assignment_types.weight / (SELECT COUNT(*) FROM assignments WHERE assignments.assignment_type_id = ?) AS weight', [req.params.id])
        );

    return res.json({ success: true, assignments });
};

exports.editAssignment = async(req,res) => {
    await Assignments.query().where('id', req.params.id).update({
        name: req.body.name,
    })
    return res.status(200).json({success:true, msg: "Assignment tahrirlandi"})
}

exports.deleteAssignment = async(req,res) => {
    await Assignments.query().where('id', req.params.id).delete()
    return res.status(200).json({success:true, msg: "Assignment o'chirildi"})

}