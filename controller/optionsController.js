const Options = require("../models/options");

exports.editOption = async (req, res) => {
  await Options.query().where('id', req.params.id).update({
    option: req.body.option
  });

  return res.status(200).json({ success: true, msg: "Option tahrirlandi" });
};

