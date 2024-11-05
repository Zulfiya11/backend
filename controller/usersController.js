const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Users = require("../models/users");
const User_applications = require("../models/user_applications");
const byscrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
    try {
        const user = await Users.query().select("*");
        return res.json({ success: true, users: user });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.createUser = async (req, res) => {
    try {
        const users = await Users.query()
            .where("phone", req.body.phone)
            .first();
        if (users) {
            return res
                .status(400)
                .json({ success: false, msg: "Foydalanuvchi mavjud" });
        }
    
        await User_applications.query().where("id", req.params.id).update({
            status: "accepted",
        });
    
        await Users.query().insert({
            phone: req.body.phone,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            date_of_birth: req.body.date_of_birth,
            role: "guest",
            access: "allowed",
        });
    
        return res
            .status(201)
            .json({ success: true, msg: "Foydalanuvchi yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editUser = async (req, res) => {
    try {
        await Users.query().where("id", req.params.id).update({
            phone: req.body.phone,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            date_of_birth: req.body.date_of_birth,
            role: req.body.role,
            access: req.body.access
        });
        return res.status(200).json({ success: true, msg: "User tahrirlandi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};


exports.login = async (req, res) => {
    try {
        const student = await Users.query().where("phone", req.body.phone).first();
        if (!student) {
            return res
                .status(404)
                .json({ success: false, msg: "Foydalanuvchi topilmadi" });
        }
        const checkPassword = await byscrypt.compareSync(
            req.body.password,
            student.password
        );
        if (!checkPassword) {
            return res.status(400).json({ success: false, msg: "Parol xato" });
        }
        const payload = {
            id: student.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        await Users.query().where("phone", req.body.phone).update({
            token: token,
        });
    
        return res.status(200).json({ success: true, token: token });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        if (req.body.step == 1) {
            const student = await Users.query()
                .where("phone", req.body.phone)
                .first();
            if (!student) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Foydalanuvchi topilmadi" });
            }
            const code = Math.floor(Math.random() * 10000);
            await Users.query().where("phone", req.body.phone).update({
                code: code,
            });
    
            return res.status(200).json({ success: true, code: code });
        }
        if (req.body.step == 2) {
            const student = await Users.query().where("phone", req.body.phone);
            if (!student) {
                return res
                    .status(400)
                    .json({ success: false, msg: "user-not-found" });
            }
    
            if (student.code != null && student.code != req.body.code) {
                return res.status(400).json({ success: false, msg: "code-fail" });
            }
    
            return res
                .status(200)
                .json({ success: true, msg: "Parol ozgartirildi" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.me = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        const user_id = decoded.id;

        const user = await Users.query().where("id", user_id).first();

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        return res
            .status(401)
            .json({ success: false, message: "Invalid token" });
    }
};
