const Days = require('../models/days')

exports.getaAllDays = async(req,res) => {
    const days = await Days.query().select('*')
    return res.json({success:true, days: days})
}
