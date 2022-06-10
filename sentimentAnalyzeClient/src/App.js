import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

import { errorHandler, isValidURL }  from './utils.js';

import { appSignal } from './appsignalc.js' //LOGGING SYSTEM: APPSIGNAL
import { ErrorBoundary } from '@appsignal/react'; //LOGGING SYSTEM: APPSIGNAL
class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {innercomp:<textarea rows="6" cols="50" id="textinput"/>,
           mode: "text",
           sentimentOutput:[],
           sentiment:true,
           bttxtclass: "btn btn-info", // inserted to control text and url button color when one is clicked 
           bturlclass: "btn btn-dark" 
        }
  
  /*
  This method returns the component based on what the input mode is.
  If the requested input mode is "text" it returns a textbox with 4 rows, text button color is blue, url button color is dark
  If the requested input mode is "url" it returns a textbox with 1 row, text button color is dark, url button color is blue
  */

  cursorPointer = document.body.style.cursor;

  renderOutput = (input_mode)=>{
    let rows = 2;
    let mode = "url";
    let btTxtClass = "btn btn-dark";
    let btUrlClass = "btn btn-info";

    //If the input mode is text make it 4 lines, changes the button color to set focus
    if(input_mode === "text"){
      mode = "text";
      rows = 6;
      btTxtClass = "btn btn-info";
      btUrlClass = "btn btn-dark";
    }
    this.setState({innercomp:<textarea rows={rows} cols="50" id="textinput"/>,
      mode: mode,
      sentimentOutput:[],
      sentiment:true,
      bttxtclass: btTxtClass,
      bturlclass: btUrlClass,
      error: ""
    });
  } 
  
  /** /ASTRO route to call Nasa API  */
  sendForAstro = () => {
    let url = "./astro";
    axios.get(url)
    .then( (response) => {
      let output = <div style={{color: 'black', fontSize:20}}>There are currently {response.data.number} astronauts in space!</div>;
      console.log("ASTRO RETURN: ", response);
      this.setState({sentimentOutput:output});
    },
    (error) => {
      errorHandler(error, error.response.data.message, "API /astro");
      console.log("MSG : ", error.response.data.message);
      alert("Error: "+ error.response.data.message);
    }
    )
  }

  /** sets the route to /<text> OR <url>/sentiment to call watson NLU API*/
  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let url = ".";
    let mode = this.state.mode
    let urlValid = isValidURL(document.getElementById("textinput").value);

    if ((mode === "url") && (urlValid===false)) {
      alert("Invalid URL. Please inform a valid URL.");
    }  
    else {
      url += "/" + mode + "/sentiment?"+ mode + "="+document.getElementById("textinput").value;

      axios.get(url)
      .then((response) => {
        console.log("SENTIMENT RETURN=",response);
        this.setState({sentimentOutput:response.data.label});
        let output = response.data.label;
        let color = "white";
        switch(output) {
          case "positive": color = "green";break;
          case "neutral": color = "yellow";break;
          case "negative": color = "red";break;
          default: color = "black";
        }
        output = <div style={{color:color,fontSize:20}}>{output}</div>;
        this.setState({sentimentOutput:output});      
      },
      (error) => {
        errorHandler(error, error.response.data.message, "API /" + mode + "/sentiment");
        console.log("MSG : ", error.response.data.message);
        alert("Error: "+ error.response.data.message);
      }
      );
    }
  }

  /** sets the route to /<text> OR <url>/emotion to call watson NLU API*/
  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let url = ".";
    let mode = this.state.mode

    let urlValid = isValidURL(document.getElementById("textinput").value);

    if ((mode === "url") && (urlValid===false)) {
      alert("Invalid URL. Please inform a valid URL.");
    }
    else {
       url += "/" + mode + "/emotion?"+ mode + "="+document.getElementById("textinput").value;

       axios.get(url)
       .then( (response) => {
           console.log("EMOTION RETURN: ", response);
           this.setState({sentimentOutput:<EmotionTable emotions={response.data}/>});
       },
       (error) => {
           errorHandler(error, error.response.data.message, "API /" + mode + "/emotion");
           console.log("MSG : ", error.response.data.message);
           alert("Error: " + error.response.data.message);
       }
       )
    }
  }
 
  /** renders app */
  render() {
    return (
      <ErrorBoundary            //**appSignal */
       instance={appSignal}>
      <div id='popupContainer'></div>
      <div className="App">
        <button className={this.state.bttxtclass} onClick={()=>{this.renderOutput('text')}}>Text</button>
        <button className={this.state.bturlclass}  onClick={()=>{this.renderOutput('url')}}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button id="btSent" className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button id="btEm" className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/><br/>
        <button id="btNasa" className="btn-primary" onClick={this.sendForAstro}>How Many Astronauts</button>
        <br/><br/>
        {this.state.sentimentOutput}
      </div>
    </ErrorBoundary> //**APPSIGNAL */
    );
    }
}

export default App;

