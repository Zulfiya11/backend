const Questions = require("../models/questions");
const Options = require("../models/options");
const { stat } = require("fs");

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = await Questions.query().insert({
      question: req.body.question,
      level_id: req.body.level_id,
      unit_id: req.body.unit_id,
      status: "active",
    });
    await Options.query().insert({
      option: req.body.true,
      isRight: "right",
      question_id: newQuestion.id,
    });
    await Options.query().insert({
      option: req.body.second,
      isRight: "wrong",
      question_id: newQuestion.id,
    });
    await Options.query().insert({
      option: req.body.third,
      isRight: "wrong",
      question_id: newQuestion.id,
    });
    await Options.query().insert({
      option: req.body.fourth,
      isRight: "wrong",
      question_id: newQuestion.id,
    });
  
    res.status(201).json({ success: true, msg: "Question yaratildi" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    let questions = await Questions.query().where('unit_id', req.params.id).andWhere('level_id', req.body.level_id);
    let result = await Promise.all(
      questions.map(async (e) => {
        let ans = await Options.query().where("question_id", e.id);
        return { ...e, options: ans };
      })
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};

exports.editQuestion = async (req, res) => {
  try {
    await Questions.query().where('id', req.params.id).update({
      question: req.body.question,
      level_id: req.body.level_id,
      status: req.body.status,
  
    });
    for (let i = 0; i < req.body.options.length; i++) {
      await Options.query().where('id', req.body.options[i].id).update({
        option: req.body.options[i].option,
        isRight: req.body.options[i].isRight,
      });
    }
  
    return res.status(200).json({ success: true, msg: "Module tahrirlandi" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};