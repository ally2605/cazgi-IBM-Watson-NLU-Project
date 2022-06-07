/* 
Configurates: logging at console with morgan and logging with Winston
*/
const winston = require('winston');
const toBoolean = require('to-boolean');

const isWinstonLogActive = toBoolean(process.env.WINSTON_ACTIVE);
const isConsoleLogActive = toBoolean(process.env.CONSOLE_ACTIVE);
const isMorganLogActive = toBoolean(process.env.MORGAN_ACTIVE);

console.log("Is Winston Log Active? ", isWinstonLogActive);
console.log("Is Morgan Log Active?", isMorganLogActive);
console.log("Is Console Log Active? ", isConsoleLogActive);

const createError = require("http-errors"); // APPSIGNAL
const logMorgan = require('morgan');

/* MORGAN LOGGING - define TOKENS here if necessary. Include all tokes also in the Morgan Session at main server file (sentimentAnalyzeServer.js). 

if (isMorganLogActive === true) {
    logMorgan.token();
}
*/


const logWinston = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ],
});
 
if ((process.env.NODE_ENV !== 'production') && (isWinstonLogActive===true) && (isConsoleLogActive===true)) {
    logWinston.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
 
module.exports = {logWinston, isWinstonLogActive, logMorgan, isMorganLogActive, isConsoleLogActive};