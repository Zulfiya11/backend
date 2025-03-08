const AssignmentTypes = require("../models/assignment_types");
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

exports.createAssignmentType = [
    verifyToken,
    async (req, res) => {
        try {
            await AssignmentTypes.query().insert({
                name: req.body.name,
                weight: req.body.weight,
                module_id: req.body.module_id,
                status: "active",
            });

            return res
                .status(201)
                .json({
                    success: true,
                    msg: "Assignment type created successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllAssignmentTypes = [
    
    verifyToken,
    async (req, res) => {
        try {
            console.log(1);
            
            const assignmentTypes = await AssignmentTypes.query()
                .where("assignment_types.module_id", req.params.id)
                .leftJoin(
                    "assignments",
                    "assignments.assignment_type_id",
                    "assignment_types.id"
                )
                .groupBy("assignment_types.id")
                .select("assignment_types.*")
                .count("assignments.id as tests_total");

            return res.json({
                success: true,
                assignment_types: assignmentTypes,
            });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.editAssignmentType = [
    verifyToken,
    async (req, res) => {
        try {
            const updatedRows = await AssignmentTypes.query()
                .where("id", req.params.id)
                .update({
                    name: req.body.name,
                    weight: req.body.weight,
                    status: req.body.status,
                });

            if (!updatedRows) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Assignment type not found" });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Assignment type updated successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];
