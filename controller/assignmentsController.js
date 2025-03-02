const Assignments = require("../models/assignments");
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

exports.createAssignment = [
    verifyToken,
    async (req, res) => {
        try {
            await Assignments.query().insert({
                name: req.body.name,
                module_id: req.body.module_id,
                assignment_type_id: req.body.assignment_type_id,
                status: "active",
            });

            return res
                .status(201)
                .json({
                    success: true,
                    msg: "Assignment created successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllAssignments = [
    verifyToken,
    async (req, res) => {
        try {
            const assignments = await Assignments.query()
                .where("assignments.assignment_type_id", req.params.id)
                .join(
                    "assignment_types",
                    "assignments.assignment_type_id",
                    "assignment_types.id"
                )
                .select("assignments.*")
                .select(
                    Assignments.raw(
                        "(assignment_types.weight / NULLIF((SELECT COUNT(*) FROM assignments WHERE assignment_type_id = ?), 0)) AS weight",
                        [req.params.id]
                    )
                );

            return res.json({ success: true, assignments });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.editAssignment = [
    verifyToken,
    async (req, res) => {
        try {
            const updatedRows = await Assignments.query()
                .where("id", req.params.id)
                .update({
                    name: req.body.name,
                    status: req.body.status,
                });

            if (!updatedRows) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Assignment not found" });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Assignment updated successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];
