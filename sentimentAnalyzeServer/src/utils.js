const { constructFilepath } = require("ibm-cloud-sdk-core");
const { logWinston, isWinstonLogActive, logMorgan, isConsoleLogActive } = require("./logger");
const { appsignal, logTracer } = require("./appsignal");

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

/*
  Function createLog: creates a log register depending on what log mode is enabled. It can register errors, 
                      incidents that must be monitored, trace information or debug information. 
  Parameters: logType - info, error ** to be implemented: warning, trace, debug modes
              message - internal error message to better identify/locate the error
              param - parameters used when the error/incident/monitoring occurred
              dateTime - date and time of the error/incident/monitorig
              error - original error that triggered the action; blank when is an info logging
  To be implemented: ** internal error Code?? 
                     ** debug, warning and trace modes
*/
function createLog (logType, message, param, dateTime, error) {

    let errorMessage = logType + ": " + dateTime + " ";
    if (param !=="") {
        errorMessage += param + " ";
    }
    if (message !== "") {
        errorMessage += message + " ";
    }
    errorMessage += error;

    /** Winston Logging: two modes implemented: error and info */
    if (isWinstonLogActive===true) {
        if (logType === "info") {
           logWinston.info(errorMessage)
        } else {
            if (logType === "error") {
                logWinston.error(errorMessage);
            }
        }
    }
    /** Console logging mode */
    if (isConsoleLogActive === true) {
        console.log(errorMessage);
    }
    /** Appsignal logging mode
     *  If AppSignal is on, all incidents will be logged automatically, except errors that must be 
     *  logged through tracer.
    */
    if ((appsignal.isActive===true) && (type == "error")){
        logTracer.setError(errorMessage);
    }

}
module.exports = {copyObj, createLog};

/* 
   Function Name: createLog - 
   Parameters: error: error message returned by application
               message: aditional text message to better locate error
               type: (error / info) - indicates the type of log to generate, currently used for winston and appsignal

function createLog (error, message, type, errorDate) {

   let errorMessage = type + " " + error + " " + message;
   if (isWinstonLogActive===true) {
       if (type == "error")
          logWinston.error(errorMessage + " " + errorDate);
       else // (type === "info")
          logWinston.info(errorMessage + " " + errorDate);
   }

   if ((appsignal.isActive===true) && (type == "error")){
       logTracer.setError(errorMessage);
   }

   if (isConsoleLogActive===true) {
       console.log(errorMessage + " " + errorDate);
   }
}
*/
