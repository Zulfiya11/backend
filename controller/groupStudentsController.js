const Group_student = require("../models/group_student");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Token required");
    }
    try {
        return jwt.verify(authHeader.split(" ")[1], secret);
    } catch (error) {
        throw new Error("Unauthorized: Invalid token");
    }
};

exports.createGroupStudent = async (req, res) => {
    try {
        verifyToken(req);
        // Token validation
            await Group_student.query().insert({
                user_id: req.body.user_id,
                group_id: Number(req.params.id),
            });
            return res
                .status(201)
                .json({ success: true, msg: "Group Student created" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllGroupStudents = async (req, res) => {
    try {
        verifyToken(req); // Token validation

        const knex = await Group_student.knex();
        const data = await knex.raw(
            `SELECT gs.id, CONCAT(u.name, ' ', u.surname) AS student_name, gs.group_id, gs.created, u.id AS student_id
            FROM group_student gs
            JOIN users u ON gs.user_id = u.id
            WHERE gs.group_id = ?;`,
            [req.params.id]
        );

        return res.json({ success: true, group_student: data[0] });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteGroupStudent = async (req, res) => {
    try {
        verifyToken(req); // Token validation

        await Group_student.query().where("id", req.params.id).delete();
        return res
            .status(200)
            .json({ success: true, msg: "Group Student deleted" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};
