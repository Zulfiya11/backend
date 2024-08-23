const Lesson_units = require('../models/lesson_units')

exports.createLessonUnit = async(req, res) => {

    await Lesson_units.query().insert({
       lesson_id: req.body.lesson_id,
       unit_id: req.body.unit_id,
       module_id: req.body.module_id,
       status: "active"
    })

    return res.status(201).json({ success: true, msg: 'Lesson yaratildi' })
}

exports.getAllLessonUnits = async(req,res) => {
    const lesson_unit = await Lesson_units.query().where('module_id', req.params.id)
    return res.json({success:true, lesson_units: lesson_unit})
}

exports.editLessonUnit = async(req,res) => {
    await Lesson_units.query().where('id', req.params.id).update({
        lesson_id: req.body.lesson_id,
        unit_id: req.body.unit_id
    })
}

exports.deleteLessonUnit = async(req,res) => {
    await Lesson_units.query().where('id', req.params.id).update({
        status: "deleted"
    })
}