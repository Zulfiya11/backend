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

exports.payBill = async (req, res) => {
    try {
        verifyToken(req);
        const data = await Bills.query()
            .where("id", req.params.id)
            .update({
                status: "paid",
                when: new Date(),
            });
        return res.status(200).json({ success: true, msg: "to'landi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.getAllBillsByStudentByModule = async (req, res) => {
    try {
        verifyToken(req);

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const studentId = decodedToken.id;

        const bills = await Bills.query()
            .where("user_id", studentId)
            .andWhere("group_id", req.params.id)
            .join("groups", "bills.group_id", "groups.id")
            .select(
                "bills.amount",
                "bills.deadline",
                "bills.when",
                "bills.status",
                "groups.name as group_name"
            );
        return res.status(200).json({ success: true, bills: bills });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


