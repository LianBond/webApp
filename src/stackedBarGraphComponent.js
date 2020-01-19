import React, {Component} from 'react';
import CanvasJS from './canvasjs.min.js';
var data;

export default class StackedBarGraphComponent extends Component {
    
    constructor(props) {
        super(props)
        data = props.data;

        }

    componentDidMount() {
        console.log(data[1]);
        var chart = new CanvasJS.Chart("chartContainer",{

            animationEnabled: true,
            theme: "dark1",
            axisX: {
                prefix: "year ",
                interval: 1,
                intervalType: "year",
            },
            axisY: {
                suffix: "%",
                maximum: 100,
            },
            toolTip: {
                shared: true
            },
            legend:{
                cursor: "pointer",
            },
            dataPointWidth: 10,
            data: [{
                type: "stackedBar",
                name: "% paid to capital",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#",
                dataPoints: data[0]
            },
            {
                type: "stackedBar",
                name: "% paid to interest",
                showInLegend: "true",
                xValueFormatString: "year #",
                yValueFormatString: "#",
                dataPoints: data[1]
            }]
        });
        chart.render();
      }
      render() {
        return (
          <div id="chartContainer" style={{height: 360 + "px", width: 100 + "%"}}>
          </div>
        );
      }
    }