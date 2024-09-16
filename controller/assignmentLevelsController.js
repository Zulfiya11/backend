const Assignment_levels = require('../models/assignment_levels')


exports.createAssignmentLevel = async(req, res) => {

    await Assignment_levels.query().insert({
        assignment_id: req.params.id,
        level_id: req.body.level_id,
        unit_id: req.body.unit_id,
        quantity: req.body.quantity
    })
        
     res.status(201).json({ success: true, msg: 'Assignment Level yaratildi' })
}

exports.getAllAssignmentLevels = async (req, res) => {
    try {
        const assignment_levels = await Assignment_levels
            .query()
            .where('assignment_levels.assignment_id', req.params.id)
            .join('units', 'assignment_levels.unit_id', 'units.id')
            .join('question_levels', 'assignment_levels.level_id', 'question_levels.id')
            .select(
                'assignment_levels.*',
                'units.name AS unit_name',
                'question_levels.name AS level_name'
            );

        return res.json({ success: true, assignment_levels: assignment_levels });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.editAssignmentLevel = async(req,res) => {
    await Assignment_levels.query().where('id', req.params.id).update({
        level_id: req.body.level_id,
        unit_id: req.body.unit_id,
        quantity: req.body.quantity
    })
    return res.status(200).json({success:true, msg: "Assignment Level tahrirlandi"})

}

exports.deleteAssignmentLevel = async(req,res) => {
    await Assignment_levels.query().where('id', req.params.id).delete()

    return res.status(200).json({success:true, msg: "Assignment Level o'chirildi"})
}