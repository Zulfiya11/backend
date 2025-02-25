const Rooms = require('../models/rooms')

exports.createRoom = async(req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.getAllRooms = async(req,res) => {
    try {
        const room = await Rooms.query().select('*')
        return res.json({success:true, rooms: room})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}


exports.editRoom = async (req, res) => {
    try {
        await Rooms.query().where('id', req.params.id).update({
            name: req.body.name,
            max_students: req.body.max_students,
            status: req.body.status
        })
         
        return res.status(200).json({ success: true, msg: "Room tahrirlandi" })
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}