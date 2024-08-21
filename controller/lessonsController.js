const Lessons = require('../models/lessons')

exports.createLesson = async(req, res) => {
    const lesson = await Lessons.query().where('name', req.body.name).first()
    if (lesson) {
        return res.status(400).json({ success: false, msg: 'Bunday lesson mavjud' })
    }

    await Lessons.query().insert({
       name: req.body.name,
       tests_total: req.body.tests_total,
       weight: req.body.weight,
       module_id: req.body.module_id
    })

    return res.status(201).json({ success: true, msg: 'Lesson yaratildi' })
}

exports.getAllLessons = async(req,res) => {
    const lesson = await Lessons.query().where('module_id', req.params.id)
    return res.json({success:true, lessons: lesson})
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