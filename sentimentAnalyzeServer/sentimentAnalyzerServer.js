console.log ("Starting server...");

const { appsignal } = require("./src/appsignal"); // LOGGING: APPSIGNAL - AT THE VERY TOP OF THE ENTRYPOINT OF APP
const express = require('express');
const { expressMiddleware, expressErrorHandler } = require("@appsignal/express"); // LOGGING: APPSIGNAL - After require(express) but before any routes and the creation of app
const { logWinston, logMorgan, isConsoleLogActive, isWinstonLogActive, isMorganLogActive } = require('./src/logger');
const { createLog, isValidURL } = require("./src/utils"); // LOGGING: logging module
const cors_app = require('cors');
const axios = require("axios");

const dotenv = require('dotenv');
dotenv.config();

const node_env = process.env.NODE_ENV;
const watson_api_key = process.env.WATSON_API_KEY;
const watson_api_url = process.env.WATSON_API_URL;
const astro_api_url = process.env.ASTRO_API_URL;

/** Application */
const app = new express();

/* testar APPSIGNAL spans 
const rootSpan = tracer.rootSpan();
console.log("***>>>", rootSpan);
*/

/*This tells the server to use the client folder for all static resources*/
app.use(express.static('client'));
app.use(cors_app());

// LOGGING SYSTEM: only logs at console if Console logging is active and for development environment
if (isMorganLogActive === true) {
    if (node_env === "development") {
       console.log("activating morgan...");
       app.use(logMorgan("dev"));
    }
}


/* IBM Watson Natural Language */
function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator ({
            apikey: watson_api_key
        }),
        serviceUrl: watson_api_url
    });
    return naturalLanguageUnderstanding;
}

app.use(expressMiddleware(appsignal)); // LOGGING: APPSIGNAL - after everything but before any routes

//**************** Routes */

//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//ROUTE: /url/emotion
app.get("/url/emotion", (req,res) => {
    let urlToAnalyze = req.query.url;

   createLog("info", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), "");
    const analyzeParams = 
        {
           "url": urlToAnalyze,
           "features": {
                "keywords": {
                "emotion": true,
                "limit": 1
                }
           }
       }
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
           return res.send(analysisResults.result.keywords[0].emotion,null,2);
        })
        .catch(err => {
            createLog("error", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), err);
            return res.sendStatus(500);
        });
  });

//ROUTE: /url/sentiment
app.get("/url/sentiment", (req,res) => {
    let urlToAnalyze = req.query.url;

    createLog("info",req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), "");
    const analyzeParams = 
         {
            "url": urlToAnalyze,
                "features": {
                    "keywords": {
                        "sentiment": true,
                         "limit": 1
                    }
                }
         }
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].sentiment,null,2);
        })
        .catch(err => {
            createLog("error", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), err);
            return res.send("Could not do desired operation: " + err);  
        });
});

//ROUTE: /text/emotion
app.get("/text/emotion", (req,res) => {
    let textToAnalyze = req.query.text;    
    createLog("info", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), "");

    const analyzeParams = 
         {
            "text": textToAnalyze,
            "features": {
                "keywords": {
                    "emotion": true,
                    "limit": 1
                }
             }
         }

    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].emotion,null,2);
        })
        .catch(err => {
           createLog("error", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), err);
           return res.send("Could not do desired operation "+err);
        });
});

// ROUTE: /text/sentiment 
app.get("/text/sentiment", (req,res) => {
    let textToAnalyze = req.query.text;    
    createLog("info", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), "");
    
    const analyzeParams = 
         {
            "text": textToAnalyze,
            "features": {
                "keywords": {
                    "sentiment": true,
                    "limit": 1
                }
             }
         }

    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
        return res.send(analysisResults.result.keywords[0].sentiment,null,2);
        })
        .catch(err => {
            createLog("error", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), err);
            return res.send("Could not do desired operation "+err);
        });
});

// ROUTE: How many astrounauts are in space
app.get("/astro", (req, res) => {
   const result = axios.get(astro_api_url)
   .then(response => {
    createLog("info", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), "");
    return res.send(response.data);
   })
   .catch(err => {
    createLog("error", req.method + " " + req.path, req.param, req.query, Date().toLocaleString().replace(",","").replace(/:.. /," "), err);
    return res.sendStatus(500);
   })
});

// APPSIGNAL -- ADD THIS AFTER ANY OTHER EXPRESS MIDDLEWARE, AND AFTER ANY ROUTES!
app.use(expressErrorHandler(appsignal));

// start server
let server = app.listen(8080, (err) => {
    if (err) {
        console.log("Error while starting server");
    } else {
       console.log('Server is listening at port:', server.address().port);
    }
});

