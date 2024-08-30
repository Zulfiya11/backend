const { group } = require('console');
const Group_lessons = require('../models/group_lessons')


exports.getAllGroupLessons = async(req,res) => {
    const group_lessons = await Group_lessons.query().where('group_id', req.params.id)
  
    return res.json({ success: true, group_lessons: group_lessons });
}

exports.editGroupLesson = async(req, res) => {
    await Group_lessons.query().where('id', req.params.id).update({
       when: req.body.when
    })

    return res.status(201).json({ success: true, msg: 'Group Lesson tahrirlandi' })
}