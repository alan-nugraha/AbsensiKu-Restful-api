/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const user = require('../controller/users');
const upload = require('../middleware/multer');
const { verifyAccess, manager } = require('../middleware/auth');

route
  .get('/profile', verifyAccess, user.getUserByID)
  .put('/update-profile', verifyAccess, upload.single('avatar'), user.updateProfile)
  .post('/register', user.register)
  .post('/login', user.login)
  .get('/semua-pegawai', verifyAccess, manager, user.semuaPegawai);

module.exports = route;
