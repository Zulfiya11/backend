const Question_levels = require("../models/question_levels");
const Questions = require("../models/questions");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1], secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: "Invalid token" });
    }
};

exports.createQuestionLevel = [
    verifyToken,
    async (req, res) => {
        try {
            const question_level = await Question_levels.query()
                .where("name", req.body.name)
                .andWhere("course_id", req.params.id)
                .first();
            if (question_level) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Question Level already exists" });
            }
            await Question_levels.query().insert({
                name: req.body.name,
                course_id: req.params.id,
            });
            res.status(201).json({
                success: true,
                msg: "Question Level created",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.getAllQuestionLevels = [
    verifyToken,
    async (req, res) => {
        try {
            const question_levels = await Question_levels.query().where(
                "course_id",
                req.params.id
            );
            res.json({ success: true, question_levels });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.editQuestionLevel = [
    verifyToken,
    async (req, res) => {
        try {
            const updated = await Question_levels.query()
                .where("id", req.params.id)
                .update({
                    name: req.body.name,
                });
            if (!updated)
                return res
                    .status(404)
                    .json({ success: false, msg: "Question Level not found" });
            res.status(200).json({
                success: true,
                msg: "Question Level updated",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.deleteQuestionLevel = [
    verifyToken,
    async (req, res) => {
        try {
            await Questions.query().where("level_id", req.params.id).delete();
            const deleted = await Question_levels.query()
                .where("id", req.params.id)
                .delete();
            if (!deleted)
                return res
                    .status(404)
                    .json({ success: false, msg: "Question Level not found" });
            res.status(200).json({
                success: true,
                msg: "Question Level deleted",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];
