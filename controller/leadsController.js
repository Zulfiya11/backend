const Leads = require("../models/leads");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { stat } = require("fs");
const { where } = require("../settings/db");

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

exports.createLead = async (req, res) => {
    try {
        const data = await Leads.query().insert({
            name: req.body.name,
            phone: req.body.phone,
            status: "pending",
            source: req.body.source,
        });
        return res.status(201).json(data);
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllLeads = async (req, res) => {
    try {
        verifyToken(req);

        const data = await Leads.query()
            .leftJoin("users", "leads.admin_id", "users.id") // Changed to LEFT JOIN
            .select(
                "leads.*",
                "users.name as admin_name",
                "users.surname as admin_surname"
            );

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.answerLead = async (req, res) => {
    try {
        verifyToken(req);
        const token = req.headers.authorization;
        const admin_id = jwt.verify(token.split(" ")[1], secret);
        const data = await Leads.query()
            .where("id", req.params.id)
            .update({
            admin_id: admin_id.id,
            status: "answered",
            subject: req.body.subject,
        });
        return res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
