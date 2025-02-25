const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const Users = require("../models/users");
const bcrypt = require("bcryptjs");

/**
 * Helper function to verify JWT token
 */
const verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return {
            error: res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized: No token provided",
                }),
        };
    }

    try {
        const token = authHeader.split(" ")[1];
        return { decoded: jwt.verify(token, secret) };
    } catch (error) {
        return {
            error: res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized: Invalid token",
                }),
        };
    }
};

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
    const { error } = verifyToken(req, res);
    if (error) return;

    try {
        const users = await Users.query().select(
            "id",
            "name",
            "surname",
            "phone",
            "role",
            "access",
            "date_of_birth"
        );
        return res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get all teachers
 */
exports.getAllTeachers = async (req, res) => {
    const { error } = verifyToken(req, res);
    if (error) return;

    try {
        const teachers = await Users.query()
            .where("role", "teacher")
            .select("id", "name", "surname");
        return res.json({ success: true, teachers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get all assistants
 */
exports.getAllAssistants = async (req, res) => {
    const { error } = verifyToken(req, res);
    if (error) return;

    try {
        const assistants = await Users.query()
            .where("role", "assistant")
            .select("id", "name", "surname");
        return res.json({ success: true, assistants });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Create a new user with a two-step verification process
 */
exports.createUser = async (req, res) => {
    try {
        const {
            step,
            phone,
            password,
            name,
            surname,
            date_of_birth,
            user_id,
            code,
        } = req.body;

        if (step === 1) {
            const existingUser = await Users.query()
                .where("phone", phone)
                .first();
            if (existingUser) {
                return res
                    .status(409)
                    .json({
                        success: false,
                        msg: "User with this phone number already exists",
                    });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const verificationCode = Math.floor(Math.random() * 10000);

            const user = await Users.query().insert({
                phone,
                password: hashedPassword,
                name,
                surname,
                date_of_birth,
                role: "guest",
                code: verificationCode,
                access: "pending",
            });

            // TODO: Add SMS sending logic here

            return res
                .status(200)
                .json({
                    success: true,
                    user_id: user.id,
                    user_phone: user.phone,
                    msg: "Enter the code sent via SMS",
                });
        }

        if (step === 2) {
            const user = await Users.query().where("id", user_id).first();
            if (!user || user.phone !== phone || user.code !== code) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        msg: "Invalid verification details",
                    });
            }

            await Users.query()
                .where("id", user_id)
                .update({ access: "allowed", code: null });
            return res
                .status(201)
                .json({ success: true, msg: "User successfully registered" });
        }

        return res
            .status(400)
            .json({ success: false, msg: "Invalid step value" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Edit user details
 */
exports.editUser = async (req, res) => {
    const { error } = verifyToken(req, res);
    if (error) return;

    try {
        const { id } = req.params;
        const { phone, password, name, surname, date_of_birth, role, access } =
            req.body;

        const updateData = {
            phone,
            name,
            surname,
            date_of_birth,
            role,
            access,
        };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await Users.query().where("id", id).update(updateData);
        return res
            .status(200)
            .json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.error("Edit User Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * User login
 */
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await Users.query()
            .select("id", "password", "access")
            .where("phone", phone)
            .first();
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, msg: "Incorrect password" });
        }

        if (user.access === "restricted") {
            return res
                .status(403)
                .json({ success: false, msg: "User access is restricted" });
        }

        const token = jwt.sign({ id: user.id }, secret, { expiresIn: "100d" });
        await Users.query().where("id", user.id).update({ token });

        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get logged-in user's information
 */
exports.me = async (req, res) => {
    const { error, decoded } = verifyToken(req, res);
    if (error) return;

    try {
        const user = await Users.query()
            .select(
                "id",
                "phone",
                "name",
                "surname",
                "date_of_birth",
                "role",
                "access"
            )
            .where("id", decoded.id)
            .first();

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("User Fetch Error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Forgot Password
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { step, phone, code } = req.body;

        const user = await Users.query().where("phone", phone).first();
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }

        if (step === 1) {
            const verificationCode = Math.floor(Math.random() * 10000);
            await Users.query()
                .where("phone", phone)
                .update({ code: verificationCode });

            return res
                .status(200)
                .json({
                    success: true,
                    msg: "Verification code sent",
                    code: verificationCode,
                });
        }

        if (step === 2 && user.code === code) {
            return res
                .status(200)
                .json({ success: true, msg: "Code verified. Reset password" });
        }

        return res.status(400).json({ success: false, msg: "Invalid code" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
