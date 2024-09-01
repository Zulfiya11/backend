const Group_enrolement_days = require('../models/group_enrolement_days')

exports.createGroupEnrolementDay = async(req, res) => {

    await Group_enrolement_days.query().insert({
       Group_enrolement_id: req.body.Group_enrolement_id,
       day_id: req.body.day_id
    })
    return res.status(201).json({ success: true, msg: 'Group enrolement day yaratildi' })
}

exports.getAllGroupEnrolementDays = async(req,res) => {
    const knex = await Group_enrolement_days.knex();

    const data = await knex.raw(`
        SELECT
            ged.id,
            d.name AS day_name,
            ged.group_enrolement_id,
            ged.created,
            d.id AS day_id
        FROM
            group_enrolement_days ged
        JOIN
            days d ON ged.day_id = d.id
        WHERE
            ged.group_enrolement_id = ?;`, [req.params.id]);
  
    return res.json({ success: true, Group_enrolement_days: data[0] });

}

exports.deleteGroupEnrolementDay = async(req,res) => {
    await Group_enrolement_days.query().where('id', req.params.id).delete()
    return res.status(200).json({success:true, msg: "Group Enrolement Day o'chirildi"})

}