/* eslint-disable no-undef */
const express = require("express");
const route = express.Router();
const users = require("./users");
const absensi = require("./absensi");
route.use("/auth", users).use("/absensi", absensi);

module.exports = route;
