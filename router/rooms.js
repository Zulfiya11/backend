const router = require('express').Router()
const roomsController = require('../controller/roomsController.js')



router.post('/create', roomsController.createRoom)

router.get('/all', roomsController.getAllRooms)

router.post('/edit/:id', roomsController.editRoom)

router.post('/delete/:id', roomsController.deleteRoom)


module.exports = router




