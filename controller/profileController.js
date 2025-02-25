// controllers/profileController.js
const userModel = require('../models/userModel');


module.exports = {
  getProfile: (req, res) => {
    const userId = req.user.id;  // Token orqali foydalanuvchi ID
    userModel.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).send({ message: 'Foydalanuvchi malumotlarini olishda xatolik!' });
      }
      if (!user) {
        return res.status(404).send({ message: 'Foydalanuvchi topilmadi!' });
      }
      res.status(200).send({
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  }
};


// controllers/profileController.js
module.exports = {
    updateProfile: (req, res) => {
      const { firstName, lastName } = req.body;
      const userId = req.user.id;  // Token orqali foydalanuvchi ID
  
      if (!firstName || !lastName) {
        return res.status(400).send({ message: 'Ism va familiya kerak!' });
      }
  
      userModel.updateUserDetails(userId, firstName, lastName, (err) => {
        if (err) {
          return res.status(500).send({ message: 'Profilni yangilashda xatolik!' });
        }
        res.status(200).send({ message: 'Profil muvaffaqiyatli yangilandi!' });
      });
    }
  };
  