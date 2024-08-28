const Questions = require("../models/questions");
const Options = require("../models/options");

exports.createQuestion = async (req, res) => {
  const newQuestion = await Questions.query().insert({
    question: req.body.question,
    level: req.body.level,
    unit_id: req.body.unit_id,
  });
  await Options.query().insert({
    option: req.body.first,
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
};

exports.getAllQuestions = async (req, res) => {
    let questions = await Questions.query().select("*");
    let result = await Promise.all(
      questions.map(async (e) => {
        let ans = await Options.query().where("question_id", e.id);
        return { ...e, options: ans };
      })
    );
    // console.log(result)
    return res.status(200).json({ success: true, data: result });
};

exports.editQuestion = async (req, res) => {
  const newQuestion = await Questions.query().insert({
    question: req.body.question,
    level: req.body.level,
    unit_id: req.body.unit_id,
  });
  await Options.query().insert({
    option: req.body.first,
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

  return res.status(200).json({ success: true, msg: "Module tahrirlandi" });
};

exports.deleteQuestion = async (req, res) => {
  await Questions.query().where("id", req.params.id).delete();
  await Options.query().where("question_id", req.params.id).delete();

  return res.status(200).json({ success: true, msg: "Question o'chirildi" });
};
