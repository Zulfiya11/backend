const Assignments = require('../models/assignments')

exports.createAssignment = async(req, res) => {
    const assignment = await Assignments.query().where('name', req.body.name).first()
    if (assignment) {
        return res.status(400).json({ success: false, msg: 'Bunday assignment mavjud' })
    }

    await Assignments.query().insert({
       name: req.body.name,
       tests_total: req.body.tests_total,
       exam_weight: req.body.exam_weight,
       module_id: req.body.module_id
    })

    return res.status(201).json({ success: true, msg: 'Assignment yaratildi' })
}

exports.getaAllAssignments = async(req,res) => {
    const assignment = await Assignments.query().select('*').where('module_id', req.params.module_id)
    return res.json({success:true, assignments: assignment})
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