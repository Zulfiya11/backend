const Modules = require('../models/modules')
const Lessons = require('../models/lessons')


exports.createModule = async(req, res) => {

     await Modules.query().insert({
       name: req.body.name,
       max_students: req.body.max_students,
       course_id: req.body.course_id,
       status: "active"
    })
        
     res.status(201).json({ success: true, msg: 'Module yaratildi' })
}

exports.getAllModules = async(req,res) => {
   
    const module = await Modules.query().where('course_id', req.params.id)

    return res.json({success:true, modules: module})
}

exports.editModule = async(req,res) => {
    await Modules.query().where('id', req.params.id).update({
        name: req.body.name,
        max_students: req.body.max_students,
        length: req.body.length
    })
    return res.status(200).json({success:true, msg: "Module tahrirlandi"})

}

exports.deleteModule = async(req,res) => {
    await Modules.query().where('id', req.params.id).update({
        status: "deleted"
    })
    return res.status(200).json({success:true, msg: "Module o'chirildi"})

}