const Lesson_units = require("../models/lesson_units");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

const verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Unauthorized: No token provided",
            });
    }
    try {
        const token = authHeader.split(" ")[1];
        return jwt.verify(token, secret);
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

exports.createLessonUnit = async (req, res) => {
    const decoded = verifyToken(req, res);
    if (!decoded || decoded.success === false) return;

    try {
        await Promise.all(
            req.body.selected_subjects.map(async (element) => {
                await Lesson_units.query().insert({
                    lesson_id: req.body.lesson_id,
                    unit_id: element,
                    module_id: req.body.module_id,
                });
            })
        );
        return res
            .status(201)
            .json({ success: true, msg: "Lesson Unit yaratildi" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllLessonUnits = async (req, res) => {
    const decoded = verifyToken(req, res);
    if (!decoded || decoded.success === false) return;

    try {
        const lesson_units = await Lesson_units.query()
            .join("lessons", "lessons.id", "lesson_units.lesson_id")
            .join("subjects", "subjects.id", "lesson_units.unit_id")
            .where("lesson_units.module_id", req.params.id)
            .select(
                "lesson_units.id AS id",
                "lesson_units.lesson_id",
                "lesson_units.unit_id",
                "lessons.name AS lesson_name",
                "subjects.name AS subject_name"
            );

        return res.json({ success: true, lesson_units });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};


// exports.editLessonUnit = async (req, res) => {
//     const decoded = verifyToken(req, res);
//     if (!decoded || decoded.success === false) return;

//     try {
//         await Lesson_units.query().where("id", req.params.id).update({
//             lesson_id: req.body.lesson_id,
//             unit_id: req.body.unit_id,
//         });
//         return res
//             .status(200)
//             .json({ success: true, msg: "Lesson Unit tahrirlandi" });
//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({ success: false, error: error.message });
//     }
// };

exports.deleteLessonUnit = async (req, res) => {
    const decoded = verifyToken(req, res);
    if (!decoded || decoded.success === false) return;

    try {
        await Lesson_units.query().where("id", req.params.id).delete();
        return res
            .status(200)
            .json({ success: true, msg: "Lesson Unit o'chirildi" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};