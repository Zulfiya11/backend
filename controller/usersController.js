const byscrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')
const User_applications = require('../models/user_applications')
const Users = require('../models/users')
// 


exports.getAllUsers = async(req, res) => {
    const user = await Users.query().select('*')
    return res.json({ success: true, users: user });

}

exports.createUser = async(req, res) => {
    const userphone = await Users.query().where('phone', req.body.phone).first()
    if (userphone) {
        return res.status(400).json({ success: false, msg: 'Foydalanuvchi mavjud' })
    }

    // const salt = await byscrypt.genSalt(12)
    // const password = await byscrypt.hashSync(req.body.password, salt)
    await Users.query().insert({
        phone: req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo,
        access: "allowed"
    })

    await User_applications.query().where('phone', req.body.phone).update({
        status: "accepted"
    })

    return res.status(201).json({ success: true, msg: 'Foydalanuvchi yaratildi' })
}

exports.editUser = async(req, res) => {
    await Users.query().where('phone', req.body.phone).update({
        phone: req.body.phone,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date_of_birth: req.body.date_of_birth,
        role: req.body.role,
        passport_series: req.body.passport_series,
        expiration_date: req.body.expiration_date,
        passport_photo: req.body.passport_photo
    })
}

exports.restrictUser = async (req,res) => {
    await Users.query().where('phone', req.body.phone).update({
        access: "restricted"
    })
}







// exports.login = async (req,res) => {
//     const student = await Students.query().where('login', req.body.login).first()
//     if(!student){
//         return res.status(404).json({success: false, msg: 'Foydalanuvchi topilmadi'})
//     }
//     const checkPassword = await byscrypt.compareSync (
//     req.body.password,
//     student.password
//     );
//     if (!checkPassword) {
//         return res.status(400).json({success:false, msg: 'Parol xato'})
//     }
//     const payload = {
//         id: student.id
//     };
//     const token = await jwt.sign(payload,secret,{expiresIn: '1d'})
//     return res.status(200).json({success:true, token: token})
// }

// exports.forgotPassword = async (req,res) => {
//     if(req.body.step == 1){
//         const student = await Students.query().where('login', req.body.login).first()
//         if (!student) {
//             return res.status(404).json({success: false, msg: 'Foydalanuvchi topilmadi'})
//         }
//         const code = Math.floor(Math.random() * 10000)
//         await Students.query().where('login',req.body.login).update({
//             code:code
//         })

//         return res.status(200).json({success: true,code:code})
//     }
//     if(req.body.step == 2){

//         const student = await Students.query().where('login',req.body.login)
//         if(!student){
//             return res.status(400).json({success: false, msg: 'user-not-found'})
//         }

//         if(student.code != null && student.code != req.body.code ){
//             return res.status(400).json({success: false, msg: 'code-fail'}) 
//         }



//         return res.status(200).json({success:true, msg: 'Parol ozgartirildi'})
//     }

// }