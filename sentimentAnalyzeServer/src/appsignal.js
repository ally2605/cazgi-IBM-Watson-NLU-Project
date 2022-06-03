// appsignal.js or src/appsignal.js
const { Appsignal } = require("@appsignal/nodejs");

const dotenv = require('dotenv');
dotenv.config();

const toBoolean = require("to-boolean");

const APPSIGNAL_APP_ENV = process.env.NODE_ENV; //-> retirar versao final, controle AGT
const APPSIGNAL_ACTIVE = toBoolean(process.env.APPSIGNAL_ACTIVE);
const isTracerActive = () => {
   if ( (APPSIGNAL_ACTIVE === true) && (toBoolean(process.env.APPSIGNAL_TRACER_ACTIVE)===true) ) {
      return true;
   } else { return false;}
}

const appsignal = new Appsignal({
  active: APPSIGNAL_ACTIVE,
  name: process.env.APPSIGNAL_APP_NAME, //** APPSIGNAL = nome da aplicacao */
  pushApiKey: process.env.APPSIGNAL_API_KEY, 
  filterParameters: ["password","pwd","pass"] //** list of pararameters that wont be recorded to appsignal, it shows [FILTERED] instead */
  /* requestHeaders: [                         default headers doesnt need to configure, are here just to exemplify 
    "accept",
    "accept-charset",
    "accept-encoding",
    "accept-language",
    "cache-control",
    "connection",
    "content-length",
    "range"
  ] */
  // logLevel: error, warning, info, debug, trace
});

const logTracer = appsignal.tracer(); //** IF APPSignal is not active, tracer will create an empty object that wont send any information */

console.log("Is AppSignal Log Active? ", appsignal.isActive);
console.log("Is AppSignal Tracer Active? ", isTracerActive());

module.exports = { appsignal, APPSIGNAL_APP_ENV, logTracer, isTracerActive };/*-> retirar export APP_ENV versao final, controle AGT */
