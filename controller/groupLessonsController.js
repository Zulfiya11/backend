const Group_lessons = require('../models/group_lessons')



exports.getAllGroupLessons = async(req,res) => {
    try {
        const group_lessons = await Group_lessons.query().where('group_id', req.params.id).join('lessons', 'group_lessons.lesson_id', 'lessons.id').select('lessons.name AS lesson_name', 'group_lessons.*', )
        return res.json({ success: true, group_lessons: group_lessons });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})        
    }


}

exports.editGroupLesson = async(req, res) => {
    try {
        await Group_lessons.query().where('id', req.params.id).update({
           lesson_date: req.body.lesson_date
        })
    
        return res.status(201).json({ success: true, msg: 'Group Lesson tahrirlandi' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}