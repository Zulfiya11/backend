const AssignmentLevels = require("../models/assignment_levels");
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

exports.createAssignmentLevel = [
    verifyToken,
    async (req, res) => {
        try {
            await AssignmentLevels.query().insert({
                assignment_id: req.params.id,
                level_id: req.body.level_id,
                unit_id: req.body.unit_id,
                quantity: req.body.quantity,
            });

            return res
                .status(201)
                .json({
                    success: true,
                    msg: "Assignment level created successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllAssignmentLevels = [
    verifyToken,
    async (req, res) => {
        try {
            const assignment_levels = await AssignmentLevels.query()
                .where("assignment_levels.assignment_id", req.params.id)
                .join("subjects", "assignment_levels.unit_id", "subjects.id")
                .join(
                    "question_levels",
                    "assignment_levels.level_id",
                    "question_levels.id"
                )
                .select(
                    "assignment_levels.*",
                    "subjects.name AS unit_name",
                    "question_levels.name AS level_name"
                );

            return res.json({ success: true, assignment_levels:assignment_levels });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ success: false, error: error.message });
        }
    },
];

exports.editAssignmentLevel = [
    verifyToken,
    async (req, res) => {
        try {
            const updatedRows = await AssignmentLevels.query()
                .where("id", req.params.id)
                .update({
                    level_id: req.body.level_id,
                    unit_id: req.body.unit_id,
                    quantity: req.body.quantity,
                });

            if (!updatedRows) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        msg: "Assignment level not found",
                    });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Assignment level updated successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.deleteAssignmentLevel = [
    verifyToken,
    async (req, res) => {
        try {
            const deletedRows = await AssignmentLevels.query()
                .where("id", req.params.id)
                .delete();

            if (!deletedRows) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        msg: "Assignment level not found",
                    });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Assignment level deleted successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];
