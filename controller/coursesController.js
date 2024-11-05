const Courses = require('../models/courses')

exports.createCourse = async(req, res) => {
    try {
        const course = await Courses.query().where('name', req.body.name).first()
        if (course) {
            return res.status(400).json({ success: false, msg: 'Bunday kurs mavjud' })
        }
    
        await Courses.query().insert({
           name: req.body.name,
           status: "active"
        })
    
        return res.status(201).json({ success: true, msg: 'Kurs yaratildi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getaAllCourses = async(req,res) => {
    try {
        const course = await Courses.query().select('*')
        return res.json({success:true, courses: course})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.editCourse = async(req,res) => {
    try {
        await Courses.query().where('id', req.params.id).update({
            name: req.body.name,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Course tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}