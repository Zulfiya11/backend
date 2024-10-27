const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Users = require("../models/users");
const User_applications = require("../models/user_applications");
const byscrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
    const user = await Users.query().select("*");
    return res.json({ success: true, users: user });
};

exports.getAllSupers = async (req, res) => {
    const user = await Users.query().select("*").where("role", "super");
    return res.json({ success: true, users: user });
};

exports.getAllStaff = async (req, res) => {
    const user = await Users.query().select("*").where("role", "staff");
    return res.json({ success: true, users: user });
};

exports.getAllModuleLeaders = async (req, res) => {
    const user = await Users.query().select("*").where("role", "module_leader");
    return res.json({ success: true, users: user });
};

exports.getAllTeachers = async (req, res) => {
    const user = await Users.query().select("*").where("role", "teacher");
    return res.json({ success: true, users: user });
};

exports.getAllAssistants = async (req, res) => {
    const user = await Users.query().select("*").where("role", "assistant");
    return res.json({ success: true, users: user });
};

exports.getAllStudents = async (req, res) => {
    const user = await Users.query().select("*").where("role", "student");
    return res.json({ success: true, users: user });
};

exports.getAllGuests = async (req, res) => {
    const user = await Users.query().select("*").where("role", "guest");
    return res.json({ success: true, users: user });
};

exports.createUser = async (req, res) => {
    const userphone = await Users.query()
        .where("phone", req.body.phone)
        .first();
    if (userphone) {
        return res
            .status(400)
            .json({ success: false, msg: "Foydalanuvchi mavjud" });
    }

    await User_applications.query().where("phone", req.body.phone).update({
        status: "accepted",
    });

    await Users.query().insert({
        phone: req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo,
        access: "allowed",
    });

    return res
        .status(201)
        .json({ success: true, msg: "Foydalanuvchi yaratildi" });
};

exports.editUser = async (req, res) => {
    await Users.query().where("phone", req.body.phone).update({
        phone: req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo,
    });
    return res.status(200).json({ success: true, msg: "User tahrirlandi" });
};

exports.restrictUser = async (req, res) => {
    await Users.query().where("phone", req.body.phone).update({
        access: "restricted",
    });
    return res.status(200).json({ success: true, msg: "User o'chirildi" });
};

exports.login = async (req, res) => {
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
};

exports.forgotPassword = async (req, res) => {
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
