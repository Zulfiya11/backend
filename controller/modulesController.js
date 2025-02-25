const Modules = require("../models/modules");
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

exports.createModule = async (req, res) => {
    try {
        verifyToken(req);

        const module = await Modules.query().where("name", req.body.name).first();

        if (module) {
            return res
                .status(400)
                .json({ success: false, msg: "Module already exists" });
        }

        await Modules.query().insert({
            name: req.body.name,
            max_students: req.body.max_students,
            course_id: req.body.course_id,
            isCore: req.body.isCore,
            order: req.body.order,
            status: "active",
        });

        res.status(201).json({
            success: true,
            msg: "Module created successfully",
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllModules = async (req, res) => {
    try {
        verifyToken(req);

        const modules = await Modules.query()
            .where("modules.course_id", req.params.id)
            .leftJoin("lessons", "lessons.module_id", "modules.id")
            .groupBy("modules.id")
            .select("modules.*")
            .count("lessons.id as length");

        return res.json({ success: true, modules });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.editModule = async (req, res) => {
    try {
        verifyToken(req);

        const updatedRows = await Modules.query()
            .where("id", req.params.id)
            .update({
                name: req.body.name,
                max_students: req.body.max_students,
                length: req.body.length,
                status: req.body.status,
                order: req.body.order,
                isCore: req.body.isCore,
            });

        if (!updatedRows) {
            return res
                .status(404)
                .json({ success: false, msg: "Module not found" });
        }

        return res
            .status(200)
            .json({ success: true, msg: "Module updated successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};
