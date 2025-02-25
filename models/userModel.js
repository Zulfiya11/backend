  const mysql = require('mysql2');
  const config = require('../config/config');

  const db = mysql.createConnection(config.dbConfig);
  db.connect((err) => {
    if (err) {
      console.error('MySQL ulanishida xatolik:', err);
    } else {
      console.log('MySQL serveriga ulanish muvaffaqiyatli!');
    }
  });

  module.exports = {
    createUser: (phoneNumber, verificationCode, verificationTime, isVerified, callback) => {
      db.query(
        'INSERT INTO users (phoneNumber, verificationCode, verificationTime, isVerified,firstName,lastName) VALUES (?, ?, ?, ?,NULL,NULL)',
        [phoneNumber, verificationCode, verificationTime, false],
        callback
      );
    },

    getUserByPhoneNumber: (phoneNumber, callback) => {
      db.query('SELECT * FROM users WHERE phoneNumber = ?', [phoneNumber], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return callback(err) ;
        }
        console.log('Rows:', rows); // SQL so'rovi natijasini tekshirish
        console.log('Number of records:', rows.length); // natijadagi yozuvlar soni
        callback(null,rows)
      });
      
    },

    updateVerificationTime: (phoneNumber, verificationCode, verificationTime, callback) => {
      db.query(
        'UPDATE users SET verificationCode = ?, verificationTime = ? WHERE phoneNumber = ?',
        [verificationCode, verificationTime, phoneNumber],
        callback
      );
    },

    updateUserVerifiedStatus: (phoneNumber, callback) => {
      db.query(
        'UPDATE users SET isVerified = true WHERE phoneNumber = ?',
        [phoneNumber],
        callback
      );
    },

    updateUserDetails: (phoneNumber, firstName, lastName, callback) => {
      db.query(
        'UPDATE users SET firstName = ?, lastName = ? WHERE phoneNumber = ?',
        [firstName, lastName, phoneNumber],
        callback
      );
    },

  
    

  };

  
