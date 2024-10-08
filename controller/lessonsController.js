const Lessons = require('../models/lessons')

exports.createLesson = async(req, res) => {

   const newLesson =  await Lessons.query().insert({
       name: req.body.name,
       module_id: req.body.module_id,
    })
    return res.status(201).json({ success: true, msg: 'Lesson yaratildi' })
}

exports.getAllLessons = async(req,res) => {
    const lesson = await Lessons.query().where('module_id', req.params.id)
    return res.json({success:true, lessons: lesson})
}

exports.editLesson = async(req,res) => {
    await Lessons.query().where('id', req.params.id).update({
        name: req.body.name
    })
    return res.status(200).json({success:true, msg: "Lesson tahrirlandi"})

}

exports.deleteLesson = async(req,res) => {
    await Lessons.query().where('id', req.params.id).delete()
    return res.status(200).json({success:true, msg: "Lesson o'chirildi"})

}