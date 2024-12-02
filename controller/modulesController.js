const Modules = require('../models/modules')
const Student_modules = require('../models/student_modules')


exports.createModule = async(req, res) => {
    try {
        await Modules.query().insert({
           name: req.body.name,
           max_students: req.body.max_students,
           course_id: req.body.course_id,
           isCore: req.body.isCore,
           order: req.body.order,
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

exports.getAllModulesByStudentForRegister = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        const modulesbystudent = await Student_modules
        .where('user_id', studentId)
        .andWhere('course_id', req.params.id);
    
    let modules = await Modules.query()
        .where('modules.course_id', req.params.id)
        .leftJoin('lessons', 'lessons.module_id', 'modules.id')
        .groupBy('modules.id')
        .select('modules.*')
        .count('lessons.id as length');
    
    if (!Array.isArray(modulesbystudent) || !Array.isArray(modules)) {
        throw new Error("Invalid data: modulesbystudent or modules is not an array");
    }
    
    const completedModuleIds = new Set(modulesbystudent.map(m => m.module_id));
    
    modules = modules.map(module => ({
        ...module,
        isCompleted: completedModuleIds.has(module.id) ? 'completed' : undefined,
    }));
    
    console.log(modules);
    

        return res.json({ success: true, modules });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

