const Rooms = require("../models/rooms");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, msg: "Failed to authenticate token" });
        }
        req.user = decoded;
        next();
    });
};

exports.createRoom = [
    verifyToken,
    async (req, res) => {
        try {
            const existingRoom = await Rooms.query()
                .where("name", req.body.name)
                .first();
            if (existingRoom) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Room already exists" });
            }

            await Rooms.query().insert({
                name: req.body.name,
                max_students: req.body.max_students,
                status: "active",
            });

            return res
                .status(201)
                .json({ success: true, msg: "Room created successfully" });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllRooms = [
    verifyToken,
    async (req, res) => {
        try {
            const rooms = await Rooms.query().select("*");
            return res.json({ success: true, rooms });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.editRoom = [
    verifyToken,
    async (req, res) => {
        try {
            const room = await Rooms.query().where("id", req.params.id).first();
            if (!room) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Room not found" });
            }

            await Rooms.query().where("id", req.params.id).update({
                name: req.body.name,
                max_students: req.body.max_students,
                status: req.body.status,
            });

            return res
                .status(200)
                .json({ success: true, msg: "Room updated successfully" });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];
