const Assignment_types = require('../models/assignment_types')

exports.createAssignmentType = async(req, res) => {
    try {
        await Assignment_types.query().insert({
           name: req.body.name,
           weight: req.body.weight,
           module_id: req.body.module_id,
           status: "active"
        })
        return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllAssignmentTypes = async (req, res) => {
    try {
        const assignmentTypes = await Assignment_types.query()
            .where('assignment_types.module_id', req.params.id)
            .leftJoin('assignments', 'assignments.assignment_type_id', 'assignment_types.id')
            .groupBy('assignment_types.id')
            .select('assignment_types.*')
            .count('assignments.id as tests_total');
        return res.json({ success: true, assignmenttypes: assignmentTypes });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editAssignmentType = async(req,res) => {
    try {
        await Assignment_types.query().where('id', req.params.id).update({
            name: req.body.name,
            weight: req.body.weight,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Assignment tpye tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}