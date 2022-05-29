// appsignal.js or src/appsignal.js
const { Appsignal } = require("@appsignal/nodejs");

const dotenv = require('dotenv');
dotenv.config();

const APPSIGNAL_APP_ENV = process.env.APPSIGNAL_APP_ENV; //-> retirar versao final, controle AGT

const appsignal = new Appsignal({
  active: true,
  name: "sentimentanalyzeserver",
  pushApiKey: process.env.APPSIGNAL_API_KEY // Note: renamed from `apiKey` in version 2.2.5
});

module.exports = { appsignal, APPSIGNAL_APP_ENV };/*-> retirar export APP_ENV versao final, controle AGT */

/*
const { Appsignal } = require("@appsignal/nodejs")

exports.appsignal = new Appsignal({
  active: true
})
*/