const Users = require('../models/users')
const User_applications = require('../models/user_applications')
const byscrypt = require('bcryptjs')
    // const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')


exports.getAllUserApplications = async (req, res) => {
    try {
        const applications = await User_applications.query().select('*');
        return res.json({ success: true, users: applications });
    } catch (error) {
        console.error("Error fetching user applications:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch user applications", error: error.message });
    }
};


exports.createUserApplication = async(req, res) => {
    try {
        if (req.body.step === 1) {
            const student = await Users.query()
                .where("phone", req.body.phone)
                .first();
            if (student) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Bunday raqamli foydalanuvchi mavjud" });
            }
            const code = Math.floor(Math.random() * 10000);
            
            //code for sending sms here
            return res.status(200).json({ success: true, code: code });
        }
        if (req.body.step === 2){
            const user = await Users.query().where('phone', req.body.phone).first()
            if (user) {
                return res.status(400).json({ success: false, msg: 'Foydalanuvchi mavjud' })
            }
            const applied = await User_applications.query().where('phone', req.body.phone).first()
            if (applied) {
                return res.status(400).json({ success: false, msg: "Foydalanuvchi ro'yxatdan o'tish uchun ariza topshirgan" })
            }
            const salt = await byscrypt.genSalt(12)
            const password = byscrypt.hashSync(req.body.password, salt)
                await User_applications.query().insert({
                phone: req.body.phone,
                password: password,
                name: req.body.name,
                surname: req.body.surname,
                date_of_birth: req.body.date_of_birth,
                role: "guest",
                status: "pending"
            })
            return res.status(201).json({ success: true, msg: 'Foydalanuvchi royhatdan otdi' })
        }

        }
  
    catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.editUserApplication = async (req,res) => {
    try {
        const user = await Users.query().where('id', req.params.id).first()
    
        await User_applications.query().where('id', req.params.id).update({
            phone:req.body.phone,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            date_of_birth: req.body.date_of_birth,
            role: req.body.role,
            status: req.body.status
        })
        return res.status(200).json({success:true, msg: "Foydalanuvchi ma'lumotlari tahrirlandi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})
    }
}

exports.denyUserApplication = async (req,res) => {
    try {
        await User_applications.query().where('id', req.params.id).update({
            status: "denied"
        })
        return res.status(200).json({success:true, msg:"Foydalanuvchi arizasi qabul qilinmadi"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, error: error.message})        
    }
}