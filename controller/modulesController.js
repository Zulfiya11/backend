const Modules = require('../models/modules')
const Group_attendance = require('../models/group_attendance')


exports.createModule = async(req, res) => {
    try {
        const newModule = await Modules.query().insert({
           name: req.body.name,
           max_students: req.body.max_students,
           course_id: req.body.course_id,
           status: "active"
        })
        
         res.status(201).json({ success: true, msg: 'Module yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllModules = async (req, res) => {
    try {
        const modules = await Modules.query()
            .where('modules.course_id', req.params.id)
            .leftJoin('lessons', 'lessons.module_id', 'modules.id')
            .groupBy('modules.id')
            .select('modules.*')
            .count('lessons.id as length');
    
        return res.json({ success: true, modules });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editModule = async(req,res) => {
    try {
        await Modules.query().where('id', req.params.id).update({
            name: req.body.name,
            max_students: req.body.max_students,
            length: req.body.length,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Module tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}