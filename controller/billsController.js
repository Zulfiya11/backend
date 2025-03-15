const Bills = require("../models/bills");
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

exports.getAllBills = async (req, res) => {
    try {
        verifyToken(req);

        const data = await Bills.query()
            .where("bills.status", "pending")
            .join("users", "bills.user_id", "users.id")
            .join("modules", "bills.module_id", "modules.id")
            .join("groups", "bills.group_id", "groups.id")
            .select(
                "bills.*",
                "users.name as user_name",
                "users.surname as user_surname",
                "modules.name as module_name",
                "groups.name as group_name"
            );
        return res.status(200).json({ success: true, data: data });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


