const Courses = require("../models/courses");
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

exports.createCourse = async (req, res) => {
    try {
        verifyToken(req);

        const existingCourse = await Courses.query().findOne({
            name: req.body.name,
        });
        if (existingCourse) {
            return res
                .status(400)
                .json({ success: false, msg: "Course already exists" });
        }

        await Courses.query().insert({
            name: req.body.name,
            status: "active",
        });

        return res
            .status(201)
            .json({ success: true, msg: "Course created successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        verifyToken(req);

        const courses = await Courses.query().select("*");
        return res.json({ success: true, courses });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.editCourse = async (req, res) => {
    try {
        verifyToken(req);

        const updatedRows = await Courses.query()
            .where("id", req.params.id)
            .update({
                name: req.body.name,
                status: req.body.status,
            });

        if (!updatedRows) {
            return res
                .status(404)
                .json({ success: false, msg: "Course not found" });
        }

        return res
            .status(200)
            .json({ success: true, msg: "Course updated successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
