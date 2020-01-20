import React, {Component} from 'react';
import calcImg from './calcImg.svg';
import fb from './firebase.js';
import './calcComp.css';
import Chart from 'chart.js';
import SavedCalculationsComponent from './SavedCalculationsComponent';
import ReactDOM from 'react-dom';
var Plotly = require('plotly')("LianBond", "Mvty3c792bQaOfxMeHtX");

export default class CalcComponent extends Component {

constructor(props) {
    super(props)
    }

render() {
      
      function makeChart(x,data1,data2) {
        var trace1 = {
          x: x,
          y: data1,
          name: '% paid to Capital',
          type: 'bar'
        };
        
        var trace2 = {
          x: x,
          y: data2,
          name: '% paid to interest',
          type: 'bar'
        };
        
        var data = [trace1, trace2];
        
        var layout = {barmode: 'stack',fileopt : "overwrite", filename : "simple-node-example"};
        
        Plotly.plot(data, layout);
        var a = document.getElementById('a');
        a.innerHTML = `
        <a href="https://plot.ly/~LianBond/0/?share_key=uf1LNYnWZPFlUIuaKedwa4" target="_blank" title="simple-node-example" style="display: block; text-align: center;"><img id="ch" src="https://i.ibb.co/rMYbbDj/load.jpg" alt="simple-node-example" style="max-width: 100%;width: 600px;"  width="600" onerror="this.onerror=null;this.src='https://i.ibb.co/rMYbbDj/load.jpg';" /></a>
        <script data-plotly="LianBond:0" sharekey-plotly="uf1LNYnWZPFlUIuaKedwa4" src="https://plot.ly/embed.js" async></script>
      `
        load();
      }

      async function load() {
        
        setTimeout(function () {
          
            var source = 'https://plot.ly/~LianBond/0.png?share_key=uf1LNYnWZPFlUIuaKedwa4',
            timestamp = (new Date()).getTime(),
            newUrl = source + '?_=' + timestamp;
            document.getElementById("ch").src = newUrl;
          
      }, 5000);
        
        
      }

      function doCalc() {
        
        let pp = document.getElementById('purchasePrice').value;
        let dep = document.getElementById('dep').value;
        let term = (document.getElementById('term').value)*12;
        let r = (document.getElementById('r').value)/100/12;
        if (term/12>80) {
          alert('dont be silly!'); 
          return;
        }
        //make sure there are no null values
        if (pp == '') {
          pp = 0;
          console.log(true);
        }
        if (dep == '') {
          dep = 0;
        }
        if (term == '') {
          term = 0;
        }
        if (r == '') {
          r = 0;
        }
        
        let above = r*(pp-dep);
        let below = 1-Math.pow((1+r),(-1*term));
        let ans = above/below;
        console.log(ans)
        if (!isNaN(ans)) {
          document.getElementById('ans').innerHTML = 'Your monthly payment is: R'+ (Math.round(ans*100)/100);
          term = term/12;
          r=r*12;
          above = r*(pp-dep);
          below = 1-Math.pow((1+r),(-1*term));
          ans = above/below;
          let cnt = 1;
          let left = 0;
          let loanAmount = pp-dep;
          let afterNMonth = loanAmount*(1+r)-ans;
          let percentagePaidToCapital = ((loanAmount-afterNMonth)/loanAmount)*100;
          let percentagePaidToInterest = 100 - percentagePaidToCapital;
          let content='';
          percentagePaidToInterest =  Math.round(percentagePaidToInterest);
          percentagePaidToCapital = Math.round(percentagePaidToCapital);
          document.getElementById('bodPercentage').innerHTML = '';
          content +='<tr>';
          content += '<td>' + cnt + '</td>';
          content += '<td>' + percentagePaidToInterest+'%' + '</td>';
          content += '<td>' + percentagePaidToCapital+'%' + '</td>';
          content += '</tr>';
          document.getElementById('bodPercentage').innerHTML = content;
          var data1 = [];
          var data2 = [];
          data1.push(percentagePaidToCapital);
          data2.push(percentagePaidToInterest);
          while (afterNMonth>=0.01) {
            cnt++;
            afterNMonth = afterNMonth*(1+r)-ans;
            percentagePaidToCapital = ((loanAmount-afterNMonth)/loanAmount)*100;
            percentagePaidToInterest = 100 - percentagePaidToCapital;
            percentagePaidToInterest =  Math.round(percentagePaidToInterest);
            percentagePaidToCapital = Math.round(percentagePaidToCapital);
            if (percentagePaidToCapital>100) {
              percentagePaidToCapital = 100;
              percentagePaidToInterest = 0;
            }
            data1.push(percentagePaidToCapital);
            data2.push(percentagePaidToInterest);
            content +='<tr>';
            content += '<td>' + cnt + '</td>';
            content += '<td>' + percentagePaidToInterest+'%' + '</td>';
            content += '<td>' + percentagePaidToCapital+'%' + '</td>';
            content += '</tr>';
            document.getElementById('bodPercentage').innerHTML = content;
          }
          document.getElementById("repaymentSplit").style.display = 'block';
          console.log(data1);
          var x = [];
          for (var i = 0; i<cnt; i++) {
            x.push('year ' + (i+1));
          }
          console.log(x);

          makeChart(x,data1,data2);
          
        } else {
          alert('Math Error. Please input valid values');
        }
    }

    function showTable() {
      var database = fb.database();
        database = database.ref().child("calculations")
        database.once('value', function(snapshot){
            if(snapshot.exists()){
                var content = '';
                snapshot.forEach(function(data){
                    var val = data.val();
                    console.log(val);
                    content +='<tr>';
                    content += '<td>' + val.name + '</td>';
                    content += '<td>' + val.purchasePrice + '</td>';
                    content += '<td>' + val.deposit + '</td>';
                    content += '<td>' + val.term + '</td>';
                    content += '<td>' + val.rate + '</td>';
                    content += '<td>' + val.ans + '</td>';
                    content += '</tr>';
                });
                console.log(content);
                document.getElementById('bod').innerHTML = content;
            }
        });
    }



    function saveCalc() {
      let pp = Number(document.getElementById('purchasePrice').value);
      let dep = Number(document.getElementById('dep').value);
      console.log(dep);
      let term = (Number(document.getElementById('term').value)*12);
      let r = Number((document.getElementById('r').value)/100/12);
    
      
      let name = (document.getElementById('name').value);
      let above = r*(pp-dep);
      let below = 1-Math.pow((1+r),(-1*term));
      let ans = above/below;
      ans = (Math.round(ans*100)/100);
      if (!isNaN(ans)) {
        term = term/12;
        r = r*100*12;
        r = (Math.round(r*100)/100);
        if (name!=='') {
          const calcRef = fb.database().ref('calculations');
          const calc = {
            purchasePrice: pp,
            deposit: dep,
            term: term,
            rate: r,
            name: name,
            ans: ans
          }
          calcRef.push(calc);
          alert('Record saved!')
          showTable();
        } else {
          alert('the name field cant be empty!');
        }
      } else {
        alert('Math Error. Please input valid values');
      }
    }
    
    return (<div className="comptext">
      
      <h4>Fixed term mortgage calculator</h4><br></br>
      <img class="eq" src={calcImg}></img><br></br>
      <form >
      <div class="form-check">
        <div class="form-group">
          <label for='purchasePrice'>Purchase price (R)</label><br></br>
          <input type="number" id='purchasePrice' placeholder='purchase price'>
          </input>
        </div>
        <div class="form-group">
          <label for='dep'>Deposit (R)</label><br></br>
          <input type="number" id='dep' placeholder='deposit'></input>
        </div>
        <div class="form-group">
          <label for='term'>Bond term (years)</label><br></br>
          <input type="number" id='term' placeholder='bond term (years)'></input>
        </div>
        <div class="form-group">
          <label for="r">Fixed interest rate (yearly %)</label><br></br>
          <input type="number" id='r' placeholder='fixed interest rate (yearly)'></input>
        </div>
        <div class="form-group">
          <button class="submit" type="button" onClick={doCalc}>CALCULATE</button>
        </div>
          <b><h6 id='ans'>Your monthly payment is:</h6></b>
        </div>
        </form>
          <input type="text" id='name' placeholder='calculation name'></input>
          <button id="calc" onClick={saveCalc}>SAVE</button>
          <div id="repaymentSplit" style={{display: 'none'}}>
          <h4 class="savedCalcHead">(Table of replayment splits) % paid to Capital Amount per year</h4>
          <div id = "table">
          <table id="percentagePerYear" class="table" >
            <thead class="thead-dark">
              <tr id="tr">
                <th>Year</th>
                <th>Interest %</th>
                <th>Capital %</th> 
              </tr>
            </thead>
            <tbody id="bodPercentage">
  
            </tbody>
        </table>
        <div id='a'></div>
        </div>
        </div>
      
      <SavedCalculationsComponent></SavedCalculationsComponent>

    </div>)
    
    }
}
