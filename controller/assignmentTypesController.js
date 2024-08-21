const Assignment_types = require('../models/assignment_types')

exports.createAssignmentType = async(req, res) => {
    const assignment_type = await Assignment_types.query().where('name', req.body.name).first()
    if (assignment_type) {
        return res.status(400).json({ success: false, msg: 'Bunday assignment type mavjud' })
    }

    await Assignment_types.query().insert({
       name: req.body.name,
       tests_total: req.body.tests_total,
       weight: req.body.weight,
       module_id: req.body.module_id
    })

    return res.status(201).json({ success: true, msg: 'Assignment type yaratildi' })
}

exports.getAllAssignmentTypes = async(req,res) => {
    const assignment_type = await Assignment_types.query().where('module_id', req.params.id)
    return res.json({success:true, assignments: assignment_type})
}

// exports.editCourse = async(req,res) => {
//     await Courses.query().where('id', req.params.id).update({
//         name: req.body.name
//     })
// }

// exports.deleteCourse = async(req,res) => {
//     await Courses.query().where('id', req.params.id).update({
//         status: req.body.status
//     })
// }