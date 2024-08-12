const Users = require('../models/users')
const User_applications = require('../models/user_applications')
const byscrypt = require('bcryptjs')
    // const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')

exports.getAllUserApplications = async(req, res) => {
    const application = await User_applications.query().select('*').where('status', "pending")
    return res.json({ success: true, users: application });
}

exports.createUserApplication = async(req, res) => {
    const user = await Users.query().where('phone', req.body.phone).first()
    if (user) {
        return res.status(400).json({ success: false, msg: 'Foydalanuvchi mavjud' })
    }
    const applied = await User_applications.query().where('phone', req.body.phone).first()
    if (applied) {
        return res.status(400).json({ success: false, msg: "Foydalanuvchi ro'yxatdan o'tish uchun ariza topshirgan" })
    }
    // const salt = await byscrypt.genSalt(12)
    // const password = await byscrypt.hashSync(req.body.password, salt)
    await User_applications.query().insert({
        phone: req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo,
        status: "pending"
    })
    return res.status(201).json({ success: true, msg: 'Foydalanuvchi royhatdan otdi' })
}

exports.editUserApplication = async (req,res) => {
    await User_applications.query().where('phone', req.body.phone).update({
        phone:req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo,
        status: req.body.status
    })
}

exports.denyUserApplication = async (req,res) =>
    await User_applications.query().where('phone', req.body.phone).update({
        status: "denied"
    })
