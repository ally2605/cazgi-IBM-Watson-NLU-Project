// appsignal.js or src/appsignal.js
const { Appsignal } = require("@appsignal/nodejs");

const dotenv = require('dotenv');
dotenv.config();

const toBoolean = require("to-boolean");

const APPSIGNAL_APP_ENV = process.env.NODE_ENV; //-> retirar versao final, controle AGT
const APPSIGNAL_ACTIVE = toBoolean(process.env.APPSIGNAL_ACTIVE);

const appsignal = new Appsignal({
  active: APPSIGNAL_ACTIVE,
  name: process.env.APPSIGNAL_APP_NAME, //**APPSIGNAL = nome da aplicacao */
  pushApiKey: process.env.APPSIGNAL_API_KEY // Note: renamed from `apiKey` in version 2.2.5
  // logLevel: error, warning, info, debug, trace
});

let logTracer = null;

if (appsignal.isActive===true) {
  logTracer = appsignal.tracer();
}

console.log("Is AppSignal Log Active? ", appsignal.isActive);

module.exports = { appsignal, APPSIGNAL_APP_ENV, logTracer };/*-> retirar export APP_ENV versao final, controle AGT */
