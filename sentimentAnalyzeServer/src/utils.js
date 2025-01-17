const { constructFilepath } = require("ibm-cloud-sdk-core");
const { logWinston, isWinstonLogActive, logMorgan, isConsoleLogActive } = require("./logger");
const { appSignal, appSignal_Tracer, isTracerActive, appSignal_rootSpan } = require("./appsignal");

function copyObj(obj) {
    var copy;
    if (obj.constructor === Object) {
        // Generic objects
        copy = {};
        for (var prop in obj) {
            copy[prop] = copyObj(obj[prop]);
        }
    }
    else if (obj.constructor === Array) {
        // Arrays
        copy = [];
        for (var i in obj) {
            copy.push(copyObj(obj[i]));
        }
    }
    else if (obj.constructor === Number || obj.constructor === String || obj.constructor === Boolean) {
        // Primitives
        copy = obj;
    }
    else {
        // Any other type of object
        copy = new obj.constructor(obj);
    }

    return copy;
}


function isValidURL (string) {
    let url;
    try {
        url = new URL(string);
    }catch (_) {
        return false;
    }
    return true;
}

/*
  Function createLog: creates a log register depending on what log mode is enabled. It can register errors, 
                      incidents that must be monitored, trace information or debug information. 
  Parameters: logType - info, error ** to be implemented: warning, trace, debug modes
              message - internal error message to better identify/locate the error
              param - parameters used when the error/incident/monitoring occurred
              dateTime - date and time of the error/incident/monitorig
              error - original error that triggered the action; blank when is an info logging
  To be implemented: ** internal error Code and correspondence with APIs returning codes?? 
                     ** debug, warning and trace modes
*/
function createLog (logType, where, message, param, query, dateTime, error) {

    let logMessage = "[" + logType + "][" + where + "]" + "[" + dateTime + "]"; 
    if ((message !=="") && (message !== undefined)) {
        logMessage += " " + message;
    }
    if ((param !=="") && (param !== undefined)) {
        logMessage += " param: " + JSON.stringify(param);
    }
    if ((query !=="") && (query !== undefined)) {
        logMessage += " query:" + JSON.stringify(query) + " ";
    }
    logMessage += error;

    /** Winston Logging: two modes implemented: error and info */
    if (isWinstonLogActive===true) {
        if (logType === "info") {
           logWinston.info(logMessage);
        } else {
            if (logType === "error") {
                logWinston.error(logMessage);
            }
        }
    }
    /** Console logging mode */
    if (isConsoleLogActive === true) {
        console.log(logMessage);
    }
    /** Appsignal logging mode
     *  If AppSignal is on, all incidents will be logged automatically, except errors that must be 
     *  logged through tracer. Tracer is created at appsignal.js.
    */
    if ((appSignal.isActive===true) && (logType == "error") && (isTracerActive()===true)){
        // const currentSpan = appSignal_Tracer.currentSpan();
        appSignal_Tracer.setError(error);
    }

}
module.exports = {copyObj, createLog, isValidURL};