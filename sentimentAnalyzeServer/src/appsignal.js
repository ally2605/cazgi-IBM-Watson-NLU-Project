// appsignal.js or src/appsignal.js
const { Appsignal } = require("@appsignal/nodejs");

const dotenv = require('dotenv');
dotenv.config();

const appsignal_api_key = process.env.APPSIGNAL_API_KEY

const appsignal = new Appsignal({
  active: true,
  name: "sentimentAnalyzeServer.js",
  pushApiKey: appsignal_api_key // Note: renamed from `apiKey` in version 2.2.5
});

module.exports = { appsignal };

/*
const { Appsignal } = require("@appsignal/nodejs")

exports.appsignal = new Appsignal({
  active: true
})
*/