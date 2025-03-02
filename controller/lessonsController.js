const Lessons = require("../models/lessons");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Unauthorized: No token provided",
            });
    }

    jwt.verify(token.split(" ")[1], secret, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Unauthorized: Invalid token",
                });
        }
        req.user = decoded;
        next();
    });
};

exports.createLesson = [
    verifyToken,
    async (req, res) => {
        try {
            const lesson = await Lessons.query().where(
                "module_id",
                req.body.module_id        
            );
            if (lesson) {
                return res.status(400).json({
                    success: false,
                    msg: "Lesson already exists",
                });
            }
    

            await Lessons.query().insert({
                name: req.body.name,
                module_id: req.body.module_id,
            });
            res.status(201).json({
                success: true,
                msg: "Lesson created successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.getAllLessons = [
    verifyToken,
    async (req, res) => {
        try {
            const lessons = await Lessons.query().where(
                "module_id",
                req.params.id
            );
            res.json({ success: true, lessons });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.editLesson = [
    verifyToken,
    async (req, res) => {
        try {
            await Lessons.query()
                .where("id", req.params.id)
                .update({ name: req.body.name });
            res.status(200).json({
                success: true,
                msg: "Lesson updated successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.deleteLesson = [
    verifyToken,
    async (req, res) => {
        try {
            await Lessons.query().where("id", req.params.id).delete();
            res.status(200).json({
                success: true,
                msg: "Lesson deleted successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];
