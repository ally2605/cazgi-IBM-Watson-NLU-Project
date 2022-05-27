const { appsignal } = require("./src/appsignal"); // APPsignal - AT THE VERY TOP OF THE ENTRYPOINT OF APP

const express = require('express');
const { expressMiddleware, expressErrorHandler } = require("@appsignal/express"); // Appsignal - After require(express) but before any routes and the creation of app

const createError = require("http-errors"); // appsignal
const morgan = require('morgan');
const logger = require('./src/logger');
const cors_app = require('cors');

const app = new express();

/*This tells the server to use the client folder for all static resources*/
app.use(express.static('client'));
app.use(morgan("dev"));
app.use(cors_app());

const dotenv = require('dotenv');
dotenv.config();

const watson_api_key = process.env.WATSON_API_KEY;
const watson_api_url = process.env.WATSON_API_URL;

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

app.use(expressMiddleware(appsignal)); // APPsignal - before any routes

//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
    // //Extract the url passed from the client through the request object
    let urlToAnalyze = req.query.url
    console.log(urlToAnalyze, " emotion", Date().toLocaleString().replace(",","").replace(/:.. /," "));
    logger.info(urlToAnalyze + "  EMOTION " + Date().toLocaleString().replace(",","").replace(/:.. /," "));

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
           logger.error( Date().toLocaleString().replace(",","").replace(/:.. /," ") + err);
           return res.send("Could not do desired operation "+err);
        });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
    let urlToAnalyze = req.query.url;
    console.log(urlToAnalyze, " sentiment", Date().toLocaleString().replace(",","").replace(/:.. /," "));
    logger.info((urlToAnalyze + "  SENTIMENT " + Date().toLocaleString().replace(",","").replace(/:.. /," ")));
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
            logger.error( Date().toLocaleString().replace(",","").replace(/:.. /," ") + err);
            return res.send("Could not do desired operation "+err);
        });
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
    let textToAnalyze = req.query.text;

    console.log(textToAnalyze.substring(0,20), " EMOTION", Date().toLocaleString().replace(",","").replace(/:.. /," "));
    logger.info(textToAnalyze.substring(0,20) + " EMOTION " + Date().toLocaleString().replace(",","").replace(/:.. /," "))
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
            logger.error( Date().toLocaleString().replace(",","").replace(/:.. /," ") + err);
           return res.send("Could not do desired operation "+err);
        });
});

app.get("/text/sentiment", (req,res) => {
    let textToAnalyze = req.query.text;

    console.log(textToAnalyze.substring(0,20), " SENTIMENT", Date().toLocaleString().replace(",","").replace(/:.. /," "));
    logger.info(textToAnalyze.substring(0,20) + " SENTIMENT "+ Date().toLocaleString().replace(",","").replace(/:.. /," "));
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
            logger.error( Date().toLocaleString().replace(",","").replace(/:.. /," ") + err);
           return res.send("Could not do desired operation "+err);
        });
});


// appsignal -- ADD THIS AFTER ANY OTHER EXPRESS MIDDLEWARE, AND AFTER ANY ROUTES!
app.use(expressErrorHandler(appsignal));

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port);
})

