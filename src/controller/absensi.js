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
            const tokenAbsen = await jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: '12h',
            });

            payload.tokenAbsen = tokenAbsen;
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
        absensi
          .pulang(Number(id), data)
          .then(() => {
            const { pulang } = result[0];
            const payload = [
              {
                ...result[0],
                pulang: moment(pulang).format('LLLL'),
              },
            ];
            if (payload.keterlambatan == 'iya') {
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
        const { masuk, pulang } = result[0];
        const payload = [
          {
            ...result[0],
            masuk: moment(masuk).format('LLLL'),
            pulang: moment(pulang).format('LLLL'),
          },
        ];
        if (payload.pulang == 'Invalid date') {
          payload.pulang = '';
        }
        if (result.length) {
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
        const { masuk, pulang } = result[0];
        const payload = [
          {
            ...result[0],
            masuk: moment(masuk).format('LLLL'),
            pulang: moment(pulang).format('LLLL'),
          },
        ];
        if (payload.pulang == 'Invalid date') {
          payload.pulang = '';
        }
        if (result.length) {
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
