const Days = require('../models/days')

exports.getaAllDays = async(req,res) => {
    try {
        const days = await Days.query().select('*')
        return res.json({success:true, days: days})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}
