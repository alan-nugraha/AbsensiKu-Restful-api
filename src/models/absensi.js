const connection = require('../confiq/db');

module.exports = {
  masuk: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO absensi SET ?', data, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  },
  pulang: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE absensi SET ? WHERE id = ?', [data, id], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  },
  getAbsensi: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT absensi.*, users.name FROM absensi LEFT JOIN users ON absensi.user_id = users.id where users.id = ${id}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  getDataAbsensi: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM absensi ORDER BY id DESC LIMIT 1`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  },
  getAbsensiById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT absensi.*, users.name FROM absensi LEFT JOIN users ON absensi.user_id = users.id where absensi.id = ${id}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  },
};
