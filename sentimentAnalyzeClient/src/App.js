import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import isValidURL from './utils.js';

class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
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
    let rows = 1;
    let mode = "url";
    let btTxtClass = "btn btn-dark";
    let btUrlClass = "btn btn-info";

    //If the input mode is text make it 4 lines, changes the button color to set focus
    if(input_mode === "text"){
      mode = "text";
      rows = 4;
      btTxtClass = "btn btn-info";
      btUrlClass = "btn btn-dark";
    }
      this.setState({innercomp:<textarea rows={rows} cols="50" id="textinput"/>,
      mode: mode,
      sentimentOutput:[],
      sentiment:true,
      bttxtclass: btTxtClass,
      bturlclass: btUrlClass
      });
  } 
  
  sendForAstro = () => {
    let url = "./astro";
    fetch (url).then((response)=>{
      response.json().then((data) => {
        let output = <div style={{color: 'black', fontSize:20}}>There are currently {data.number} astronauts in space!</div>;
        console.log(output);
        this.setState({sentimentOutput:output});
      }).catch ( (error) => {
        console.log("Erro interno", error);
        alert("Erro ao consultar serviço. Tente novamente.");
      })
    })
    .catch ((error) => {
      console.log("Erro Interno:", error);
      alert("Erro ao consultar serviço. Tente novamente.");
    })
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let url = ".";
    let mode = this.state.mode
    let urlValid = isValidURL(document.getElementById("textinput").value);

    if ((mode === "url") && (urlValid===false)) {
      alert("Invalid URL. Please inform a valid URL.");
    }  
    else {
       url = url+"/" + mode + "/sentiment?"+ mode + "="+document.getElementById("textinput").value;

       fetch(url).then((response)=>{
        response.json().then((data)=>{
           this.setState({sentimentOutput:data.label});
           let output = data.label;
           let color = "white"
           switch(output) {
             case "positive": color = "green";break;
             case "neutral": color = "yellow";break;
             case "negative": color = "red";break;
             default: color = "black";
            }
           output = <div style={{color:color,fontSize:20}}>{output}</div>
           this.setState({sentimentOutput:output});
        })
        .catch( (error) => {
            alert("Erro ao consultar serviço. Tente novamente.");
        })
      });
    }
  }

  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let url = ".";
    let mode = this.state.mode

    let urlValid = isValidURL(document.getElementById("textinput").value);

    if ((mode === "url") && (urlValid===false)) {
      alert("Invalid URL. Please inform a valid URL.");
    }
    else {
       url = url+"/" + mode + "/emotion?"+ mode + "="+document.getElementById("textinput").value;

       fetch(url).then((response)=>{
         response.json().then((data)=>{
         this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
       })
       .catch( (error) => {
         alert("Erro ao consultar serviço. Tente novamente.");
       })
     });
    }
  }
  
  render() {
    return (  
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
    );
    }
}

export default App;
