const { stat } = require('fs');
const Assignments = require('../models/assignments')

exports.createAssignment = async(req, res) => {
    try {
        const newCourse = await Assignments.query().insert({
            name: req.body.name,
            module_id: req.body.module_id,
            assignment_type_id: req.body.assignment_type_id, 
            status: "active"    
         })
         return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignments.query()
            .where('assignment_type_id', req.params.id)
            .select('assignments.*')
            .join('assignment_types', 'assignments.assignment_type_id', 'assignment_types.id')
            .select(
                Assignments.raw('assignment_types.weight / (SELECT COUNT(*) FROM assignments WHERE assignments.assignment_type_id = ?) AS weight', [req.params.id])
            );
        return res.json({ success: true, assignments });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editAssignment = async(req,res) => {
    try {
        await Assignments.query().where('id', req.params.id).update({
            name: req.body.name,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Assignment tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}