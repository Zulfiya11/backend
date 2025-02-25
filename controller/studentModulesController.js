const Modules = require("../models/modules");
const Student_modules = require("../models/student_modules");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Group_student = require("../models/group_student");


exports.getAllModulesByStudentForRegister = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        const modulesbystudent = await Student_modules.query()
            .where("user_id", studentId)
            .andWhere("course_id", req.params.id);

        let modules = await Modules.query()
            .where("modules.course_id", req.params.id)
            .leftJoin("lessons", "lessons.module_id", "modules.id")
            .groupBy("modules.id")
            .select("modules.*")
            .count("lessons.id as length");

        if (!Array.isArray(modulesbystudent) || !Array.isArray(modules)) {
            throw new Error(
                "Invalid data: modulesbystudent or modules is not an array"
            );
        }

        const completedModuleIds = new Set(
            modulesbystudent.map((m) => m.module_id)
        );

        modules = modules.map((module) => ({
            ...module,
            isCompleted: completedModuleIds.has(module.id)
                ? "completed"
                : "register",
        }));

        console.log(modules);

        return res.json({ success: true, modules });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllModulesByStudent = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        const modulesbystudent = await Student_modules.query()
            .where("user_id", studentId)
            .join("modules", "student_modules.module_id", "modules.id")
            .select(
                "student_modules.isGraduated",
                "student_modules.module_id",
                "modules.*"
            );

        return res.json({ success: true, modules: modulesbystudent });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};
