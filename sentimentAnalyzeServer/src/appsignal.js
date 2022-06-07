// appsignal.js or src/appsignal.js

let appSignal = {};
let appSignal_Tracer = {};
let appSignal_rootSpan = {};
let isTracerActive = () => {};

/** In Case APPSIGNAL is descontinued, start commenting HERE */

const dotenv = require('dotenv');
dotenv.config();

const toBoolean = require("to-boolean");

const APPSIGNAL_APP_ENV = process.env.NODE_ENV; //-> retirar versao final, controle AGT
const APPSIGNAL_ACTIVE = toBoolean(process.env.APPSIGNAL_ACTIVE);

isTracerActive = () => {
   if ( (APPSIGNAL_ACTIVE === true) && (toBoolean(process.env.APPSIGNAL_TRACER_ACTIVE)===true) ) {
      return true;
   } else { return false;}
}

const { Appsignal } = require("@appsignal/nodejs");

appSignal = new Appsignal({
  active: APPSIGNAL_ACTIVE,
  name: process.env.APPSIGNAL_APP_NAME, //** APPSIGNAL = nome da aplicacao */
  pushApiKey: process.env.APPSIGNAL_API_KEY, 
  namespace: "web",
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

if ( (appSignal.isActive === true) && (isTracerActive()) ) {
   appSignal_Tracer = appSignal.tracer(); //** IF APPSignal is not active, tracer will create an empty object that wont send any information */
   appSignal_rootSpan = appSignal_Tracer.rootSpan();
}

console.log("Is AppSignal Log Active? ", appSignal.isActive);
console.log("Is AppSignal Tracer Active? ", isTracerActive());

/** In Case APPSIGNAL is descontinued, finish commenting HERE */

module.exports = { appSignal, APPSIGNAL_APP_ENV, appSignal_Tracer, isTracerActive, appSignal_rootSpan };/*-> retirar export APP_ENV versao final, controle AGT */
