const LessonReportTypes = require("../models/lesson_report_types");
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

exports.createLessonReportType = [
    verifyToken,
    async (req, res) => {
        try {
            await LessonReportTypes.query().insert({
                name: req.body.name,
                weight: req.body.weight,
                module_id: req.body.module_id,
                status: "active",
            });
            return res
                .status(201)
                .json({
                    success: true,
                    msg: "Lesson report type created successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.getAllLessonReportTypes = [
    verifyToken,
    async (req, res) => {
        try {
            const lessonReportTypes = await LessonReportTypes.query().where(
                "module_id",
                req.params.id
            );
            return res.json({
                success: true,
                lesson_report_types: lessonReportTypes,
            });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];

exports.editLessonReportType = [
    verifyToken,
    async (req, res) => {
        try {
            const updatedRows = await LessonReportTypes.query()
                .where("id", req.params.id)
                .update({
                    name: req.body.name,
                    weight: req.body.weight,
                    status: req.body.status,
                });

            if (!updatedRows) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        msg: "Lesson report type not found",
                    });
            }

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Lesson report type updated successfully",
                });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ success: false, error: error.message });
        }
    },
];
