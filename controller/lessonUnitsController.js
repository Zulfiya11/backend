const Lesson_units = require("../models/lesson_units");

exports.createLessonUnit = async (req, res) => {

    req.body.selected_subjects.forEach(async element => {

    await Lesson_units.query().insert({
        lesson_id: req.body.lesson_id,
        unit_id: element,
        module_id: req.body.module_id
      });
});
  return res.status(201).json({ success: true, msg: "Lesson Unit yaratildi" });
};

exports.getAllLessonUnits = async (req, res) => {
  const knex = await Lesson_units.knex();

  const data = await knex.raw(`
SELECT
    lu.id,
    l.name AS lesson_name,
    u.name AS unit_name,
    lu.module_id,
    lu.created
FROM
    lesson_units lu
JOIN
    lessons l ON lu.lesson_id = l.id
JOIN
    units u ON lu.unit_id = u.id;`);

  return res.json({ success: true, lesson_units: data[0] });
};

exports.editLessonUnit = async (req, res) => {
  await Lesson_units.query().where("id", req.params.id).update({
    lesson_id: req.body.lesson_id,
    unit_id: req.body.unit_id,
  });
  return res.status(200).json({success:true, msg: "Lesson Unit tahrirlandi"})

};

exports.deleteLessonUnit = async (req, res) => {
  await Lesson_units.query().where("id", req.params.id).delete();
  return res.status(200).json({success:true, msg: "Lesson Unit o'chirildi"})

};
