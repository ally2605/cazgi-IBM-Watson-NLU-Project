import Appsignal from "@appsignal/javascript"; // For ES Module

export const appSignal = new Appsignal ({
  active: process.env.REACT_APP_APPSIGNAL_ACTIVE,
  key: process.env.REACT_APP_APPSIGNAL_API_KEY, 
  name: process.env.REACT_APP_APPSIGNAL_APP_NAME,//Front-end api key
  namespace: process.env.REACT_APP_APPSIGNAL_NAMESPACE
});

console.log(process.env.REACT_APP_APPSIGNAL_API_KEY);
console.log(process.env.REACT_APP_APPSIGNAL_APP_NAME);
console.log(process.env.REACT_APP_APPSIGNAL_NAMESPACE);
console.log(process.env.REACT_APP_APPSIGNAL_ACTIVE);

