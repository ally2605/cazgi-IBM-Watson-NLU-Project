// appsignal.js or src/appsignal.js
const { Appsignal } = require("@appsignal/nodejs");

const dotenv = require('dotenv');
dotenv.config();

const toBoolean = require("to-boolean");

const APPSIGNAL_APP_ENV = process.env.NODE_ENV; //-> retirar versao final, controle AGT
const APPSIGNAL_ACTIVE = toBoolean(process.env.APPSIGNAL_ACTIVE);

const appsignal = new Appsignal({
  active: APPSIGNAL_ACTIVE,
  name: process.env.APPSIGNAL_APP_NAME, //** APPSIGNAL = nome da aplicacao */
  pushApiKey: process.env.APPSIGNAL_API_KEY, 
  filterParameters: ["password","pwd","pass"] //** list of pararameters that wont be recorded to appsignal, it shows [FILTERED] instead */
  // logLevel: error, warning, info, debug, trace
});

const logTracer = appsignal.tracer(); //** Tracer only will be active if appSginal is active */

console.log("Is AppSignal Log Active? ", appsignal.isActive);

module.exports = { appsignal, APPSIGNAL_APP_ENV, logTracer };/*-> retirar export APP_ENV versao final, controle AGT */
