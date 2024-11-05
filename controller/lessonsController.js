const Lessons = require('../models/lessons')

exports.createLesson = async(req, res) => {
    try {
           const newLesson =  await Lessons.query().insert({
               name: req.body.name,
               module_id: req.body.module_id,
            })
            return res.status(201).json({ success: true, msg: 'Lesson yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllLessons = async(req,res) => {
    try {
        const lesson = await Lessons.query().where('module_id', req.params.id)
        return res.json({success:true, lessons: lesson})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.editLesson = async(req,res) => {
    try {
        await Lessons.query().where('id', req.params.id).update({
            name: req.body.name
        })
        return res.status(200).json({success:true, msg: "Lesson tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.deleteLesson = async(req,res) => {
    try {
        await Lessons.query().where('id', req.params.id).delete()
        return res.status(200).json({success:true, msg: "Lesson o'chirildi"})        
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}