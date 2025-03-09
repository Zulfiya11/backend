const Group_student_assignments = require("../models/group_student_assignments");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req) => {
    const token = req.headers.authorization;
    if (!token) throw new Error("Token required");

    try {
        return jwt.verify(token.split(" ")[1], secret);
    } catch (error) {
        throw new Error("Invalid token");
    }
};
exports.getAllGroupStudentAssignmentsByModule = async (req, res) => {
    try {

        verifyToken(req);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, msg: "Unauthorized" }); 
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id;
        const groupStudentAssignments = await Group_student_assignments.query()
            .where("group_student_assignments.user_id", userId)
            .andWhere("group_student_assignments.module_id", req.params.id)
            .andWhere("group_student_assignments.status", "not completed")
            .join("assignments", "group_student_assignments.assignment_id", "assignments.id")
            .join("assignment_types", "assignments.assignment_type_id", "assignment_types.id")
            .select(
                "assignments.name as assignment_name",
                "assignments.id as assignment_id",
                "assignment_types.name as assignment_type_name",
                "assignment_types.id as assignment_type_id",
                "group_student_assignments.*"
            );
        return res.json({
            success: true,
            group_student_assignments: groupStudentAssignments,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: error.message });
    }
};

exports.getAllGroupStudentAssignmentsByModuleByCompleted = async (req, res) => {
    try {

        verifyToken(req);

        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        const userId = decoded.id;
        const groupStudentAssignments = await Group_student_assignments.query()
            .where("group_student_assignments.user_id", userId)
            .andWhere("group_student_assignments.module_id", req.params.id)
            .andWhere("group_student_assignments.assignment_type_id", req.body.assignment_type_id)
            .andWhere("group_student_assignments.status", "completed")
            .join("assignment_types", "group_student_assignments.assignment_type_id", "assignment_types.id")
            .join("assignments", "group_student_assignments.assignment_id", "assignments.id")
            .select(
                "assignments.name as assignment_name",
                "assignments.id as assignment_id",
                "assignment_types.name as assignment_type_name",
                "assignment_types.id as assignment_type_id",
                "group_student_assignments.id as group_student_assignment_id",
                "group_student_assignments.status as status",
                "group_student_assignments.when as when",
                "group_student_assignments.result as result"
        )
        return res.json({
            success: true,
            group_student_assignments: groupStudentAssignments
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: error.message });    
    };
};
