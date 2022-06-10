import { appSignal } from "./appsignalc";
import toBoolean from 'to-boolean';

export const isAppSignalActive = toBoolean(process.env.REACT_APP_APPSIGNAL_ACTIVE);

export function isValidURL (string) {
    try {
        let newurl = new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

export function errorHandler (error, message, where) {
   if (isAppSignalActive === true) {
      console.log("PARAMENTRO: ", error);
      let err = new Error ("[" + where + "] " + message);
      err.name = error.response.statusText;
      err.cause = error.response.status;     
      console.log("NEW ERROR: ", {err});
      appSignal.sendError(err);
   }
}