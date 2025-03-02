const Subjects = require("../models/subjects");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, msg: "No or invalid token provided" });
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, msg: "Invalid or expired token" });
    }
};

exports.createSubject = [
    verifyToken,
    async (req, res) => {
        try {
            const subject = await Subjects.query()
                .where("name", req.body.name)
                .andWhere("module_id", req.body.module_id)
                .first();
            if (subject) {
                return res.status(400).json({
                    success: false,
                    msg: "Subject already exists",
                });
            }
            const { name, module_id } = req.body;
            if (!name || !module_id) {
                return res.status(400).json({
                    success: false,
                    msg: "Name and module_id are required",
                });
            }

            await Subjects.query().insert({
                name,
                module_id,
                status: "active",
            });

            return res
                .status(201)
                .json({ success: true, msg: "Subject created successfully" });
        } catch (error) {
            console.error("Error creating subject:", error);
            return res
                .status(500)
                .json({ success: false, error: "Internal Server Error" });
        }
    },
];

exports.getAllSubjects = [
    verifyToken,
    async (req, res) => {
        try {
            const units = await Subjects.query().where(
                "module_id",
                req.params.id
            );

            return res.json({ success: true, units });
        } catch (error) {
            console.error("Error fetching units:", error);
            return res
                .status(500)
                .json({ success: false, error: "Internal Server Error" });
        }
    },
];

exports.editSubject = [
    verifyToken,
    async (req, res) => {
        try {
            const { name, status } = req.body;
            const { id } = req.params;

            const existingUnit = await Subjects.query().findById(id);
            if (!existingUnit) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Subject not found" });
            }

            await Subjects.query().where("id", id).update({ name, status });

            return res
                .status(200)
                .json({ success: true, msg: "Subject updated successfully" });
        } catch (error) {
            console.error("Error updating subject:", error);
            return res
                .status(500)
                .json({ success: false, error: "Internal Server Error" });
        }
    },
];
