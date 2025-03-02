const Modules = require("../models/modules");
const Student_modules = require("../models/student_modules");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Group_student = require("../models/group_student");


exports.createStudentModule = async (req, res) => {
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

        const moduleExists = await Student_modules.query()
            .where("user_id", studentId)
            .andWhere("module_id", req.params.id)
            .first();

        if (moduleExists) {
            return res
                .status(400)
                .json({ success: false, msg: "student is already applied" });
        }

        await Student_modules.query().insert({
            user_id: studentId,
            module_id: req.params.id,
            course_id: req.body.course_id,
            isGraduated: "applied"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: error.message });
    }
}

exports.getAllStudentModulesByStudent = async (req, res) => {
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

        // Get student's enrolled modules
        const studentModules = await Student_modules.query()
            .where("user_id", studentId)
            .andWhere("course_id", req.params.id);

        // Get all modules for the course
        let modules = await Modules.query()
            .where("modules.course_id", req.params.id)
            .leftJoin("lessons", "lessons.module_id", "modules.id")
            .groupBy("modules.id")
            .select("modules.*")
            .count("lessons.id as length");

        if (!Array.isArray(studentModules) || !Array.isArray(modules)) {
            throw new Error(
                "Invalid data: studentModules or modules is not an array"
            );
        }

        // Convert order to numbers for sorting
        modules = modules.map((module) => ({
            ...module,
            order: module.isCore === "core" ? Number(module.order) : null,
        }));

        // Sort core modules by order
        const coreModules = modules
            .filter((module) => module.isCore === "core")
            .sort((a, b) => a.order - b.order);

        // Identify completed, applied, and studying modules
        const graduatedModules = new Set();
        const appliedModules = new Set();
        const studyingModules = new Set();

        for (const sm of studentModules) {
            if (sm.isGraduated === "completed") {
                graduatedModules.add(sm.module_id);
            } else if (sm.isGraduated === "applied") {
                appliedModules.add(sm.module_id);
            } else if (sm.isGraduated === "studying") {
                studyingModules.add(sm.module_id);
            }
        }

        let lastGraduatedOrder = -1;
        let lastStudyingOrder = -1;

        // Find the highest completed (graduated) module order
        for (const module of coreModules) {
            if (graduatedModules.has(module.id)) {
                lastGraduatedOrder = module.order;
            }
            if (studyingModules.has(module.id)) {
                lastStudyingOrder = module.order;
            }
        }

        // Determine the first available module if no records exist
        const firstModuleOrder =
            coreModules.length > 0 ? coreModules[0].order : null;

        // Determine registration status
        modules = modules.map((module) => {
            if (graduatedModules.has(module.id)) {
                return { ...module, isGraduated: "completed" }; // Ensure completed modules remain "completed"
            }

            if (appliedModules.has(module.id)) {
                return { ...module, isGraduated: "applied" };
            }

            if (studyingModules.has(module.id)) {
                return { ...module, isGraduated: "studying" };
            }

            if (module.isCore === "core") {
                if (
                    studentModules.length === 0 &&
                    module.order === firstModuleOrder
                ) {
                    return { ...module, isGraduated: "register" }; // Allow first module if no records exist
                }

                if (module.order === lastGraduatedOrder + 1) {
                    return { ...module, isGraduated: "register" }; // Unlock next after graduated
                }

                if (module.order === lastStudyingOrder + 1) {
                    return { ...module, isGraduated: "register" }; // Unlock next after studying
                }

                return { ...module, isGraduated: "locked" }; // Lock all others
            }

            return { ...module, isGraduated: "register" }; // Non-core modules remain registerable
        });

        return res.json({ success: true, modules });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};


exports.getAllStudentModulesApplied= async (req, res) => {
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

        const module_enrollments_by_student = await Student_modules.query()
            .select(
                "student_modules.id",
                "student_modules.module_id",
                "student_modules.course_id",
                "student_modules.user_id",
                "modules.name as module_name", // Alias modules.name
                "modules.max_students", // Fetch max_students from modules table
                "courses.name as course_name", // Alias courses.name
                "users.name as user_name", // Alias users.name
                "users.surname as user_surname" // Alias users.surname
            )
            .join("modules", "student_modules.module_id", "modules.id")
            .join("courses", "student_modules.course_id", "courses.id")
            .join("users", "student_modules.user_id", "users.id")
            .where("student_modules.isGraduated", "applied"); // Filter by "applied"

        // Group modules by module_id
        const groupedModules = module_enrollments_by_student.reduce(
            (acc, enrollment) => {
                const moduleId = enrollment.module_id;

                if (!acc[moduleId]) {
                    acc[moduleId] = {
                        module_id: moduleId,
                        module_name: enrollment.module_name,
                        course_id: enrollment.course_id,
                        course_name: enrollment.course_name,
                        max_students: enrollment.max_students,
                        students: [],
                    };
                }

                // Add user details to the students array
                acc[moduleId].students.push({
                    id: enrollment.id,
                    user_id: enrollment.user_id,
                    name: enrollment.user_name,
                    surname: enrollment.user_surname,
                });

                return acc;
            },
            {}
        );

        // Convert grouped object to an array and calculate total students
        const groupedModulesArray = Object.values(groupedModules).map((module) => ({
            ...module,
            total_students: module.students.length, // Add total students
        }));

        return res.json({ success: true, modules: groupedModulesArray });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, msg: error.message });
    }
}

exports.createStudentModuleByAdmin = async (req, res) => {
    try {
        const studentmodule = await Student_modules.query().where("user_id", req.params.id).andWhere("module_id", req.body.module_id).first();
        if (studentmodule) {
            return res.status(400).json({ success: false, msg: "User is already enrolled in this module" });
        }
        const { module_id, course_id } = req.body;
        await Student_modules.query().insert({
            user_id: req.params.id,
            module_id: module_id,
            course_id: course_id,
            isGraduated: "applied",
        });
        return res.json({ success: true, msg: "Module yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteStudentModuleByAdmin = async (req, res) => {
    try {
        await Student_modules.query().where("id", req.params.id).delete();
        return res.json({ success: true, msg: "Module o'chirildi" });
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
