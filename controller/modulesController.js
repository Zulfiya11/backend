const Modules = require('../models/modules')
const Lessons = require('../models/lessons')


exports.createModule = async(req, res) => {
    const module = await Modules.query().where('name', req.body.name).first()
    if (module) {
        return res.status(400).json({ success: false, msg: 'Bunday module mavjud' })
    }

    const newModule = await Modules.query().insert({
       name: req.body.name,
       max_students: req.body.max_students,
       length: req.body.length,
       course_id: req.body.course_id,
       status: "active"
    })

    // const module_id = newModule.id
        
    for (let i = 0; i < req.body.length; i++) {
        await Lessons.query().insert({
            name: `Lesson ${i+1}`,
            module_id: newModule.id,
            status: "active"
        })
    }
     res.status(201).json({ success: true, msg: 'Module yaratildi' })
}

exports.getAllModules = async(req,res) => {
    console.log(req.params);
    
    const module = await Modules.query().where('course_id', req.params.id)
    return res.json({success:true, modules: module})
}

exports.editModule = async(req,res) => {
    await Modules.query().where('id', req.params.id).update({
        name: req.body.name,
        max_students: req.body.max_students,
        length: req.body.length
    })
}

exports.deleteModule = async(req,res) => {
    await Modules.query().where('id', req.params.id).update({
        status: "deleted"
    })
}