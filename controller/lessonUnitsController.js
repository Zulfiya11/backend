const Lesson_units = require("../models/lesson_units");

exports.createLessonUnit = async (req, res) => {
  try {
      req.body.selected_subjects.forEach(async element => {

      await Lesson_units.query().insert({
          lesson_id: req.body.lesson_id,
          unit_id: element,
          module_id: req.body.module_id
        });
      });
      return res.status(201).json({ success: true, msg: "Lesson Unit yaratildi" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};

exports.getAllLessonUnits = async (req, res) => {
  try {
    const lesson_units = await Lesson_units.query()
        .join("lessons", "lessons.id", "lesson_units.lesson_id")
        .join("units", "units.id", "lesson_units.unit_id")
        .where("lesson_units.module_id", req.params.id)
        .select(
            "lesson_units.id AS id",
            "lesson_units.lesson_id",
            "lesson_units.unit_id",
            "lessons.name AS lesson_name",
            "units.name AS unit_name"
        );

    return res.json({ success: true, lesson_units: lesson_units });
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};



exports.editLessonUnit = async (req, res) => {
  try {
    await Lesson_units.query().where("id", req.params.id).update({
      lesson_id: req.body.lesson_id,
      unit_id: req.body.unit_id,
    });
    return res.status(200).json({success:true, msg: "Lesson Unit tahrirlandi"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }

};

exports.deleteLessonUnit = async (req, res) => {
  try {
    await Lesson_units.query().where("id", req.params.id).delete();
    return res.status(200).json({success:true, msg: "Lesson Unit o'chirildi"})
  } catch (error) {
    console.log(error);
    return res.status(400).json({success: false, error: error.message})
  }
};