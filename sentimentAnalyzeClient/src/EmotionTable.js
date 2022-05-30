import React from 'react';
import './bootstrap.min.css';


// Creates the html table with the emotions returned by Watson
class EmotionTable extends React.Component {
    render() {
      //Returns the emotions as an HTML table
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
              Object.entries(this.props.emotions).map((mapentry) => {
                  return (
                      <tr>
                          <td>{mapentry[0]}</td>
                          <td>{mapentry[1]}</td>
                      </tr>
                  )
              })
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;