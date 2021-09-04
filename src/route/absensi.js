/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const route = express.Router();
const absensi = require('../controller/absensi');
const { verifyAccess, verifyAbsen, manager } = require('../middleware/auth');

route
  .get('/history-pribadi', verifyAccess, absensi.historyAbsensi)
  .get('/cek-history/:id', verifyAccess, manager, absensi.cekHistoryAbsensi)
  .post('/masuk', verifyAccess, absensi.masuk)
  .put('/pulang', verifyAbsen, absensi.pulang);

module.exports = route;
