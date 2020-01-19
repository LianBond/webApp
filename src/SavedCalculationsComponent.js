import React, {Component} from 'react';
import calcImg from './calcImg.svg';
import fb from './firebase.js';
import './calcComp.css';
import CanvasJS from './canvasjs.min.js';
import CanvasJSChart from './canvasjs.min.js';


export default class SavedCalculationsComponent extends Component {

constructor(props) {
    super(props)
    }

    render() {
        var chart = new CanvasJS.Chart("chartContainer",{
            animationEnabled: true,
            title:{
                text: "Repayment split stacked bar graph"
            },
            axisX: {
                prefix: "year "
            },
            axisY: {
                suffix: "%"
            },
            toolTip: {
                shared: true
            },
            legend:{
                cursor: "pointer",
            },
            data: [{
                type: "stackedBar",
                name: "% paid to capital",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#%",
                dataPoints: [
                    { x: 1, y: 56 },
                    { x: 2, y: 45 },
                    { x: 3, y: 71 },
                    { x: 4, y: 41 },
                    { x: 5, y: 60 },
                ]
            },
            {
                type: "stackedBar",
                name: "% paid to interest",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#%",
                dataPoints: [
                    { x: 1, y: 56 },
                    { x: 2, y: 45 },
                    { x: 3, y: 71 },
                    { x: 4, y: 41 },
                    { x: 5, y: 60 },
                ]
            }]
        });

        const options =  {
            animationEnabled: true,
            title:{
                text: "Repayment split stacked bar graph"
            },
            axisX: {
                prefix: "year "
            },
            axisY: {
                suffix: "%"
            },
            toolTip: {
                shared: true
            },
            legend:{
                cursor: "pointer",
            },
            data: [{
                type: "stackedBar",
                name: "% paid to capital",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#%",
                dataPoints: [
                    { x: 1, y: 56 },
                    { x: 2, y: 45 },
                    { x: 3, y: 71 },
                    { x: 4, y: 41 },
                    { x: 5, y: 60 },
                ]
            },
            {
                type: "stackedBar",
                name: "% paid to interest",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#%",
                dataPoints: [
                    { x: 1, y: 56 },
                    { x: 2, y: 45 },
                    { x: 3, y: 71 },
                    { x: 4, y: 41 },
                    { x: 5, y: 60 },
                ]
            }]
        }
      
        var database = fb.database();
          database = database.ref().child("calculations")
          database.once('value', function(snapshot){
              if(snapshot.exists()){
                  var content = '';
                  snapshot.forEach(function(data){
                      var val = data.val();
                      //console.log(val);
                      content +='<tr>';
                      content += '<td>' + val.name + '</td>';
                      content += '<td>' + val.purchasePrice + '</td>';
                      content += '<td>' + val.dep + '</td>';
                      content += '<td>' + val.term + '</td>';
                      content += '<td>' + val.rate + '</td>';
                      content += '<td>' + val.ans + '</td>';
                      content += '</tr>';
                  });
                  //console.log(content);
                  document.getElementById('bod').innerHTML = content;
              }
          });
      
      return (<div className="comptext">
        <h4 class="savedCalcHead">Saved calculations</h4>
        <div id = "table">
          <table id="savedCalcs" class="table" >
            <thead class="thead-dark">
              <tr id="tr">
                <th>Name</th>
                <th>Purchase price</th>
                <th>Deposit</th> 
                <th>Term</th>
                <th>Rate</th>
                <th>Monthly payment</th>
              </tr>
            </thead>
            <tbody id="bod">
  
            </tbody>
        </table>

          </div>
        
  
      </div>)
      
      }
}
