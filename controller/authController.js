  const jwt = require('jsonwebtoken');
  const { Vonage } = require('@vonage/server-sdk');
  const userModel = require('../models/userModel');
  const config = require('../config/config');
  const moment = require('moment-timezone');

  const vonage = new Vonage({
    apiKey: config.vonage.apiKey,
    apiSecret: config.vonage.apiSecret,
  });

  let verificationCode = '';

  module.exports = {
    sendSms: (req, res) => {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).send({ message: 'Telefon raqami kerak!' });
      }
      const phoneRegex = /^\+?[0-9]{9,15}$/;
      if(!phoneRegex.test(phoneNumber)){
        return res.status(400).send({message:"Telefon raqami yaroqsiz!"})
      }
      const uzTime = moment.tz(new Date(), 'Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss');


      userModel.getUserByPhoneNumber(phoneNumber, (err, rows) => {
        if (err) {
          return res.status(500).send({ message: 'Foydalanuvchini tekshirishda xatolik!' });
        }

        if (rows.length > 0) {
          const user = rows[0];
          if (user.isVerified) {
            const token = jwt.sign({ phoneNumber: user.phoneNumber, id: user.id }, config.jwtSecret, { expiresIn: '1h' });
            return res.status(200).send({ message: 'Tizimga muvaffaqiyatli kirdingiz!', token });
          }
          // Tasdiqlash kodi generatsiyasi
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
         text = `Sizning tasdiqlash kodingiz: ${verificationCode}`;

          userModel.updateVerificationTime(phoneNumber, verificationCode, uzTime, (err) => {
            if (err) {
              return res.status(500).send({ message: 'Malumotni yangilashda xatolik!' });
            }
            sendSmsToUser(phoneNumber, text, res);
          });
        } else {
          userModel.createUser(phoneNumber, verificationCode, uzTime, false, (err) => {
            if (err) {
              return res.status(500).send({ message: 'Malumotni saqlashda xatolik!' });
            }
            sendSmsToUser(phoneNumber, text, res);
          });
        }
      });
    },

    verifyCode: (req, res) => {
      const { phoneNumber, code } = req.body;

      if (!phoneNumber || !code) {
        return res.status(400).send({ message: 'Telefon raqami va kod kerak!' });
      }

      const phoneRegex = /^\+?[0-9]{9,15}$/;
      if(!phoneRegex.test(phoneNumber)){
        return res.status(400).send({message:"Telefon raqami yaroqsiz!"})
      }

      
      userModel.getUserByPhoneNumber(phoneNumber, (err, rows) => {
        if (err) {
          return res.status(500).send({ message: 'Ma\'lumotni olishda xatolik!' });
        }

        if (rows.length === 0) {
          return res.status(404).send({ message: 'Foydalanuvchi topilmadi!' });
        }

        const user = rows[0];
        const verificationTime = moment.utc(user.verificationTime).tz('Asia/Tashkent');
        const currentTime = moment.tz(new Date(), 'Asia/Tashkent');

        if (currentTime.diff(verificationTime, 'seconds') > 60) {
          return res.status(400).send({ message: 'Kod muddati tugadi!' });
        }
  
        if (code === user.verificationCode) {
          if (!user.isVerified) {
            userModel.updateUserVerifiedStatus(phoneNumber,(err) => {
              if(err){
                return res.status(500).send({message: 'Tasdiqlash holatini yangilashda xatolik!' })
              }  
            })
            // Foydalanuvchi hali tasdiqlanmagan bo'lsa, ism va familiya so'rash
            return res.status(200).send({
              message: 'Kod tasdiqlandi, endi ism va familiyangizni kiriting!',
              step: 'enter_details',
            });
          } else {
            const token = jwt.sign({ phoneNumber: user.phoneNumber, id: user.id }, config.jwtSecret, { expiresIn: '1h' });
            return res.status(200).send({ message: 'Tizimga muvaffaqiyatli kirdingiz!', token });
          }
        } else {
          return res.status(400).send({ message: 'Kod noto‘g‘ri!' });
        }
      });
    },

    saveDetails: (req, res) => {
      const { phoneNumber, firstName, lastName } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).send({ message: 'Ism va familiya kerak!' })

      }
      const phoneRegex = /^\+?[0-9]{9,15}$/;
      if(!phoneRegex.test(phoneNumber)){
        return res.status(400).send({message:"Telefon raqami yaroqsiz!"})
      }
      // console.log('Phone Number:', phoneNumber); // Phone number'ni tekshirib chiqing
      const nameRegex = /^[A-Za-zА-Яа-яЎўҚқҒғҲҳЁё\s'-]+$/;
      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
          return res.status(400).send({ message: 'Ism va familiya yaroqsiz!' });
      }
  
  //     firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  // lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

      userModel.getUserByPhoneNumber(phoneNumber, (err, rows) => {
        if (err) return res.status(500).send({ message: 'Malumotni tekshirishda xatolik!' });
          
      console.log(rows.length );
        if (rows.length === 0) {
          return res.status(404).send({ message: 'Foydalanuvchi topilmadi!' });
        }

        const user = rows[0];
        console.log("user",user);

        if (!user.isVerified) {
          return res.status(400).send({ message: 'Foydalanuvchi tasdiqlanmagan!' });
        }

        userModel.updateUserDetails(phoneNumber, firstName, lastName, (err) => {
          if (err) return res.status(500).send({ message: 'Malumotni saqlashda xatolik!' });

          const token = jwt.sign({ phoneNumber: user.phoneNumber, id: user.id }, config.jwtSecret, { expiresIn: '1h' });
          res.status(200).send({ message: 'Malumotlar muvaffaqiyatli saqlandi. Tizimga kirdingiz!', token });
        });
      });
    }
  };

  function sendSmsToUser(phoneNumber, text, res) {
    vonage.sms.send({ to: phoneNumber, from: 'Vonage APIs', text })
      .then(() => res.status(200).send({ message: 'SMS yuborildi!' }))
      .catch(err => res.status(500).send({ message: 'SMS yuborishda xatolik!', error: err }));
  }
