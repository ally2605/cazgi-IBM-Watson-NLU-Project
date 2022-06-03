import Appsignal from "@appsignal/javascript"; // For ES Module

const appsignal = new Appsignal ({
  key: process.env.REACT_APP_APPSIGNAL_API_KEY, 
  name: process.env.REACT_APP_APPSIGNAL_APP_NAME,//Front-end api key
  namespace: "web"
});

console.log(process.env.REACT_APP_APPSIGNAL_API_KEY);
console.log(process.env.REACT_APP_APPSIGNAL_APP_NAME);

export default appsignal;
