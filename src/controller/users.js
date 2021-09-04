/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const users = require('../models/users');
const bcrypt = require('bcryptjs');
const helper = require('../helper/response');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    const { name, nik, email, password } = req.body;
    const cekNik = await users.findNik(nik);
    const cekEmail = await users.findEmail(email);
    if (cekNik.length > 0) {
      return helper.response(res, 'Nik sudah ada', null, 401);
    }
    if (cekEmail.length > 0) {
      return helper.response(res, 'Email sudah ada', null, 401);
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const data = {
          name: name,
          nik: nik,
          email: email,
          password: hash,
          roles: 'pegawai',
        };
        users
          .register(data)
          .then(() => {
            jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, res) => {
              if (err) {
                res.send('failed');
              }
            });
            delete data.password;
            helper.response(res, 'Register Success', data, 200);
          })
          .catch((err) => {
            helper.response(res, err.message, null, 500);
          });
      });
    });
  },
  login: async (req, res, next) => {
    try {
      const checkUser = await users.findNik(req.body.nik);
      if (checkUser.length > 0) {
        bcrypt.compare(req.body.password, checkUser[0].password, async (err, resCompare) => {
          if (resCompare) {
            const { id, name, roles, avatar } = checkUser[0];
            const payload = {
              id,
              name,
              roles,
              avatar,
              ...checkUser[0],
            };
            delete payload.email;
            delete payload.password;
            const token = await jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: '24h',
            });
            payload.token = token;
            helper.response(res, 'Login success', payload, 200);
          } else {
            helper.response(res, 'Password wrong', null, 401);
          }
        });
      } else {
        helper.response(res, 'Nik tidak terdaftar', null, 401);
      }
    } catch (error) {
      helper.response(res, error.message, null, 400);
    }
  },
  getUserByID: (req, res) => {
    const id = req.userId;
    users
      .getUserById(id)
      .then((result) => {
        helper.response(res, 'ok', result[0]);
      })
      .catch((err) => {
        helper.response(res, 'Not Found', null, 404);
      });
  },
  updateProfile: async (req, res) => {
    const id = req.userId;
    const { name, password } = req.body;
    const data = {};
    if (name) {
      data.name = name;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      data.password = hash;
    }
    if (req.file) {
      data.avatar = `file/${req.file.filename}`;
    }
    users
      .updateUser(Number(id), data)
      .then((result) => {
        if (result.affectedRows) {
          helper.response(res, 'Succes Update Profile', 200);
        }
      })
      .catch((err) => {
        helper.response(res, err.message, null, 401);
      });
  },
  semuaPegawai: (req, res) => {
    users
      .getAllUser()
      .then((result) => {
        const pegawai = result.filter((item) => {
          if (item.roles != 'manager') {
            return item;
          }
        });
        helper.response(res, 'Data berhasil diambil', pegawai, 200);
      })
      .catch((error) => {
        helper.response(res, error.message, null, 400);
      });
  },
};
