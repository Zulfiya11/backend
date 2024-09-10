const Modules = require('../models/modules')
const Group_attendance = require('../models/group_attendance')


exports.createModule = async(req, res) => {

    const newModule = await Modules.query().insert({
       name: req.body.name,
       max_students: req.body.max_students,
       course_id: req.body.course_id,
       status: "active"
    })

    await Group_attendance.query().insert({
        name: "Attendance",
        module_id: newModule.id
    })
        
     res.status(201).json({ success: true, msg: 'Module yaratildi' })
}

exports.getAllModules = async (req, res) => {
    const modules = await Modules.query()
        .where('modules.course_id', req.params.id)
        .leftJoin('lessons', 'lessons.module_id', 'modules.id')
        .groupBy('modules.id')
        .select('modules.*')
        .count('lessons.id as length');

    return res.json({ success: true, modules });
};

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