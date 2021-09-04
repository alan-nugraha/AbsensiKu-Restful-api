const absensi = require('../models/absensi');
const helper = require('../helper/response');
const jwt = require('jsonwebtoken');
const moment = require('moment');
moment.locale('id');
module.exports = {
  masuk: (req, res) => {
    const data = {
      user_id: req.userId,
      masuk: new Date(),
    };
    const cekTerlambat = data.masuk.getHours();
    if (cekTerlambat > 7) {
      data.keterlambatan = 'iya';
    }
    absensi
      .masuk(data)
      .then(() => {
        absensi
          .getDataAbsensi()
          .then(async (result) => {
            const { masuk } = result[0];
            const payload = [
              {
                ...result[0],
                masuk: moment(masuk).format('LLLL'),
              },
            ];
            const tokenAbsen = await jwt.sign(payload[0], process.env.SECRET_KEY, {
              expiresIn: '12h',
            });
            payload[0].tokenAbsen = tokenAbsen;
            if (payload[0].keterlambatan == 'iya') {
              return helper.response(res, 'Absensi success, jangan terlambat lagi ya', payload, 200);
            }
            helper.response(res, 'Absensi success', payload, 200);
          })
          .catch((error) => {
            helper.response(res, error.message, null, 400);
          });
      })
      .catch((error) => {
        helper.response(res, error.message, null, 410);
        console.log(error);
      });
  },
  pulang: (req, res) => {
    const id = req.absensi_id;
    const data = {
      pulang: new Date(),
    };
    absensi
      .getAbsensiById(Number(id))
      .then((result) => {
        console.log(result, 'abes');
        absensi
          .pulang(Number(id), data)
          .then(() => {
            const { masuk, pulang } = result[0];
            const payload = [
              {
                ...result[0],
                masuk: moment(masuk).format('LLLL'),
                pulang: moment(pulang).format('LLLL'),
              },
            ];
            if (payload[0].keterlambatan == 'iya') {
              return helper.response(res, 'Hati-hati dijalan, jangan terlambat lagi ya', payload, 200);
            }
            return helper.response(res, 'Hati-hati dijalan', payload, 200);
          })
          .catch((error) => {
            return helper.response(res, error.message, null, 410);
          });
      })
      .catch((error) => {
        return helper.response(res, error.message, null, 410);
      });
  },
  historyAbsensi: (req, res) => {
    const id = req.userId;
    absensi
      .getAbsensi(Number(id))
      .then((result) => {
        const payload = result.map((item) => {
          return {
            ...item,
            masuk: moment(item.masuk).format('LLLL'),
            pulang:
              moment(item.pulang).format('LLLL') == 'Invalid date'
                ? 'Belum absen pulang'
                : moment(item.pulang).format('LLLL'),
          };
        });
        if (payload.length) {
          helper.response(res, 'History absensi', payload, 200);
        } else {
          helper.response(res, 'belum ada history', payload, 200);
        }
      })
      .catch((error) => {
        helper.response(res, error.message, null, 400);
      });
  },
  cekHistoryAbsensi: (req, res) => {
    const id = req.params.id;
    absensi
      .getAbsensi(Number(id))
      .then((result) => {
        const payload = result.map((item) => {
          return {
            ...item,
            masuk: moment(item.masuk).format('LLLL'),
            pulang:
              moment(item.pulang).format('LLLL') == 'Invalid date'
                ? 'Belum absen pulang'
                : moment(item.pulang).format('LLLL'),
          };
        });
        if (payload.length) {
          helper.response(res, 'History absensi', payload, 200);
        } else {
          helper.response(res, 'belum ada history', payload, 200);
        }
      })
      .catch((error) => {
        helper.response(res, error.message, null, 400);
      });
  },
};
