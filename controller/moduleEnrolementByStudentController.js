const Module_enrolements_by_student = require("../models/module_enrolements_by_student");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

exports.createModuleEnrolementByStudent = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({
                    success: false,
                    msg: "Unauthorized: No token provided",
                });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        const user_id = decoded.id;

        const { module_id, course_id } = req.body;

        if (!module_id || !course_id) {
            return res
                .status(400)
                .json({
                    success: false,
                    msg: "module_id and course_id are required",
                });
        }

        const moduleEnroled = await Module_enrolements_by_student.query()
            .where("user_id", user_id)
            .andWhere("module_id", module_id)
            .first();

        if (moduleEnroled) {
            return res
                .status(400)
                .json({
                    success: false,
                    msg: "User is already enrolled in this module",
                });
        }

        await Module_enrolements_by_student.query().insert({
            user_id: user_id,
            module_id: module_id,
            course_id: course_id,
        });

        res.status(201).json({ success: true, msg: "Module yaratildi" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllModuleEnrolementsByStudent = async (req, res) => {
    try {
        // Perform a join to fetch module_name, max_students, course_name, and user details
        const module_enrolements_by_student =
            await Module_enrolements_by_student.query()
                .select(
                    "module_enrolement_by_student.id",
                    "module_enrolement_by_student.module_id",
                    "module_enrolement_by_student.course_id",
                    "module_enrolement_by_student.user_id",
                    "modules.name as module_name", // Alias modules.name
                    "modules.max_students", // Fetch max_students from modules table
                    "courses.name as course_name", // Alias courses.name
                    "users.name as user_name", // Alias users.name
                    "users.surname as user_surname" // Alias users.surname
                )
                .join(
                    "modules",
                    "module_enrolement_by_student.module_id",
                    "modules.id"
                ) // Adjust `modules.id` to the actual primary key of the modules table
                .join(
                    "courses",
                    "module_enrolement_by_student.course_id",
                    "courses.id"
                ) // Adjust `courses.id` to the actual primary key of the courses table
                .join(
                    "users",
                    "module_enrolement_by_student.user_id",
                    "users.id"
                ); // Adjust `users.id` to the actual primary key of the users table

        // Group modules by module_id
        const groupedModules = module_enrolements_by_student.reduce(
            (acc, enrollment) => {
                const moduleId = enrollment.module_id;

                if (!acc[moduleId]) {
                    acc[moduleId] = {
                        module_id: moduleId,
                        module_name: enrollment.module_name, // Use aliased module_name
                        course_id: enrollment.course_id,
                        course_name: enrollment.course_name, // Use aliased course_name
                        max_students: enrollment.max_students, // Fetched from modules table
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
        const groupedModulesArray = Object.values(groupedModules).map(
            (module) => ({
                ...module,
                total_students: module.students.length, // Add total students
            })
        );

        return res.json({ success: true, modules: groupedModulesArray });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.createModuleEnrolementByStudentByAdmin = async (req, res) => {
    try {
        const { module_id, course_id } = req.body;

        if (!module_id || !course_id) {
            return res.status(400).json({
                success: false,
                msg: "module_id and course_id are required",
            });
        }

        const moduleEnroled = await Module_enrolements_by_student.query()
            .where("user_id", req.params.id)
            .andWhere("module_id", module_id)
            .first();

        if (moduleEnroled) {
            return res.status(400).json({
                success: false,
                msg: "User is already enrolled in this module",
            });
        }

        await Module_enrolements_by_student.query().insert({
            user_id: req.params.id,
            module_id: module_id,
            course_id: course_id,
        });

        res.status(201).json({ success: true, msg: "Module yaratildi" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteModuleEnrolementByStudent = async (req, res) => {
    try {
        await Module_enrolements_by_student.query().where("id", req.params.id).delete()

        res.status(201).json({ success: true, msg: "Module enrolement by student o'chirildi" });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
