const Courses = require('../models/courses')

exports.createCourse = async(req, res) => {
    const course = await Courses.query().where('name', req.body.name).first()
    if (course) {
        return res.status(400).json({ success: false, msg: 'Bunday kurs mavjud' })
    }

    await Courses.query().insert({
       name: req.body.name,
       status: "active"
    })

    return res.status(201).json({ success: true, msg: 'Kurs yaratildi' })
}

exports.getaAllCourses = async(req,res) => {
    const course = await Courses.query().select('*')
    return res.json({success:true, courses: course})
}

exports.editCourse = async(req,res) => {
    await Courses.query().where('id', req.params.id).update({
        name: req.body.name,
    })
    return res.status(200).json({success:true, msg: "Course tahrirlandi"})

}

exports.deleteCourse = async(req,res) => {
    await Courses.query().where('id', req.params.id).update({
        status: "deleted"
    })
    return res.status(200).json({success:true, msg: "Course o'chirildi"})

}