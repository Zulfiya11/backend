const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Users = require("../models/users");
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

        await Users.query().where("id", req.params.id).update({
            status: "accepted",
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

exports.getAllUserApplications = async (req, res) => {
    try {
        const applications = await Users.query()
            .whereNotNull("status")
            .select("*");
        return res.json({ success: true, users: applications });
    } catch (error) {
        console.error("Error fetching user applications:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to fetch user applications",
                error: error.message,
            });
    }
};

exports.createUserApplication = async (req, res) => {
    try {
        if (req.body.step === 1) {
            const student = await Users.query()
                .where("phone", req.body.phone)
                .first();
            if (student) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        msg: "Bunday raqamli foydalanuvchi mavjud",
                    });
            }
            const code = Math.floor(Math.random() * 10000);
            const salt = await byscrypt.genSalt(12);
            const password = byscrypt.hashSync(req.body.password, salt);
            const user = await Users.query().insert({
                phone: req.body.phone,
                password: password,
                name: req.body.name,
                surname: req.body.surname,
                date_of_birth: req.body.date_of_birth,
                status: "verifying",
                code: code,
            });
            //code for sending sms here
            return res
                .status(200)
                .json({ success: true, id: user.id, phone: user.phone });
        }
        if (req.body.step === 2) {
            const user = await Users.query()
                .where("phone", req.body.phone)
                .first();

            if (req.body.code !== user.code) {
                return res
                    .status(400)
                    .json({ success: false, msg: "code fail" });
            }

            await Users.query().where("id", req.body.id).update({
                status: "pending",
                code: null,
            });

            return res
                .status(201)
                .json({ success: true, msg: "Foydalanuvchi royhatdan otdi" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};
exports.editUserApplication = async (req, res) => {
    try {
        await Users.query().where("id", req.params.id).update({
            phone: req.body.phone,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            date_of_birth: req.body.date_of_birth,
            role: req.body.role,
            status: req.body.status,
        });
        return res
            .status(200)
            .json({
                success: true,
                msg: "Foydalanuvchi ma'lumotlari tahrirlandi",
            });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};

exports.denyUserApplication = async (req, res) => {
    try {
        await Users.query().where("id", req.params.id).update({
            status: "denied",
        });
        return res
            .status(200)
            .json({
                success: true,
                msg: "Foydalanuvchi arizasi qabul qilinmadi",
            });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.message });
    }
};