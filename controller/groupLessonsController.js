const Group_lessons = require('../models/group_lessons')
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req) => {
    const token = req.headers.authorization;
    if (!token) throw new Error("Token required");

    try {
        return jwt.verify(token.split(" ")[1], secret);
    } catch (error) {
        throw new Error("Invalid token");
    }
};


exports.getAllGroupLessons = async(req,res) => {
    try {
        verifyToken(req);
        const group_lessons = await Group_lessons.query().where('group_id', req.params.id)
            .join('lessons', 'group_lessons.lesson_id', 'lessons.id')
            .join("rooms", "group_lessons.room_id", "rooms.id")
            .select(
                'lessons.name AS lesson_name',
                'rooms.name AS room_name',
                'group_lessons.*',)
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