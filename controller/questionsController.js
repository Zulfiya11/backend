const Questions = require("../models/questions");
const Options = require("../models/options");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, msg: "No token provided" });
    }

    jwt.verify(token.split(" ")[1], secret, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, msg: "Failed to authenticate token" });
        }
        req.user = decoded;
        next();
    });
};

exports.createQuestion = [
    verifyToken,
    async (req, res) => {
        try {

            const question = await Questions.query().findOne({
                question: req.body.question
            })

            if (question) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Question already exists" });
            }
            const newQuestion = await Questions.query().insert({
                question: req.body.question,
                level_id: req.body.level_id,    
                unit_id: req.body.unit_id,
                status: "active",
            });

            for (let i = 0; i < req.body.options.length; i++) {
                await Options.query().insert({
                    question_id: newQuestion.id,
                    option: req.body.options[i].option,
                    isRight: req.body.options[i].isRight,
                });
            }

            res.status(201).json({
                success: true,
                msg: "Question created successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.getAllQuestions = [
    verifyToken,
    async (req, res) => {
        try {
            const questions = await Questions.query()
                .where("unit_id", req.params.id)
                .andWhere("level_id", req.body.level_id);

            const result = await Promise.all(
                questions.map(async (q) => {
                    const options = await Options.query().where(
                        "question_id",
                        q.id
                    );
                    return { ...q, options };
                })
            );

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];

exports.editQuestion = [
    verifyToken,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { question, level_id, status, options } = req.body;

            await Questions.query()
                .where({ id })
                .update({ question, level_id, status });

            await Promise.all(
                options.map(({ id, option, isRight }) =>
                    Options.query().where({ id }).update({ option, isRight })
                )
            );

            res.status(200).json({
                success: true,
                msg: "Question updated successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
];
