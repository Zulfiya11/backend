const Lesson_report_types = require('../models/lesson_report_types')

exports.createLessonReportType = async(req, res) => {
    try {
        await Lesson_report_types.query().insert({
           name: req.body.name,
           weight: req.body.weight,
           module_id: req.body.module_id
        })
        return res.status(201).json({ success: true, msg: 'Lesson report type yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllLessonReportTypes = async(req,res) => {
    try {
        const lesson_report_type = await Lesson_report_types.query().where('module_id', req.params.id)
        return res.json({success:true, lesson_report_types: lesson_report_type})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.editLessonReportType = async(req,res) => {
    try {
        await Lesson_report_types.query().where('id', req.params.id).update({
            name: req.body.name,
            weight: req.body.weight,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Lesson Report Type tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}