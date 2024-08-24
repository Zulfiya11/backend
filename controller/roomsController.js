const Rooms = require('../models/rooms')

exports.createRoom = async(req, res) => {
    const room = await Rooms.query().where('name', req.body.name).first()
    if (room) {
        return res.status(400).json({ success: false, msg: 'Bunday xona mavjud' })
    }

    await Rooms.query().insert({
       name: req.body.name,
       max_students: req.body.max_students,
       status: "active"
    })

    return res.status(201).json({ success: true, msg: 'Xona yaratildi' })
}

exports.getAllRooms = async(req,res) => {
    const room = await Rooms.query().select('*')
    return res.json({success:true, rooms: room})
}

exports.editRoom = async(req,res) => {
    await Rooms.query().where('id', req.params.id).update({
        name: req.body.name,
        max_students: req.body.max_students
    })
    return res.status(200).json({success:true, msg: "Room tahrirlandi"})

}

exports.deleteRoom = async(req,res) => {
    await Rooms.query().where('id', req.params.id).update({
        status: "deleted"
    })
    return res.status(200).json({success:true, msg: "Room o'chirildi"})

}