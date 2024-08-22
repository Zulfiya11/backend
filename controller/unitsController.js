const Units = require('../models/units')

exports.createUnit = async(req, res) => {

    await Units.query().insert({
       name: req.body.name,
       module_id: req.body.module_id,
       status: "active"
    })

    return res.status(201).json({ success: true, msg: 'Subject yaratildi' })
}

exports.getAllUnits = async(req,res) => {
    const unit = await Units.query().where('module_id', req.params.id)
    return res.json({success:true, units: unit})
}

exports.editUnit = async(req,res) => {
    await Units.query().where('id', req.params.id).update({
        name: req.body.name,

    })
}

exports.deleteUnit = async(req,res) => {
    await Units.query().where('id', req.params.id).update({
        status: "deleted"
    })
}