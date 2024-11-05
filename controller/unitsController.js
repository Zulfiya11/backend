const Units = require("../models/units");

exports.createUnit = async (req, res) => {
    try {
        await Units.query().insert({
            name: req.body.name,
            module_id: req.body.module_id,
            status: "active",
        });
    
        return res.status(201).json({ success: true, msg: "Subject yaratildi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.getAllUnits = async (req, res) => {
    try {
        const unit = await Units.query().where("module_id", req.params.id);
        return res.json({ success: true, units: unit });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};

exports.editUnit = async (req, res) => {
    try {
        await Units.query().where("id", req.params.id).update({
            name: req.body.name,
            status: req.body.status,
        });
        return res.status(200).json({ success: true, msg: "Subject tahrirlandi" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
};
