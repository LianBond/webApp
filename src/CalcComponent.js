import React, {Component} from 'react';
import calcImg from './calcImg.svg';
import fb from './firebase.js';
import './calcComp.css';

export default class CalcComponent extends Component {

constructor(props) {
    super(props)
    }

render() {
      console.log(document.getElementsByTagName("style")[2]);
      function doCalc() {
        let pp = document.getElementById('purchasePrice').value;
        let dep = document.getElementById('dep').value;
        let term = (document.getElementById('term').value)*12;
        let r = (document.getElementById('r').value)/100/12;
        let above = r*(pp-dep);
        let below = 1-Math.pow((1+r),(-1*term));
        let ans = above/below;
        
        document.getElementById('z').innerHTML = 'Your monthly payment is: R'+ans;
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
                    content += '<td>' + val.dep + '</td>';
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

    function toggleTable(first) {
        
        var x = document.getElementById("table");
        if (x.style.display === "none") {
          x.style.display = "block";
          showTable();
        } else {
          x.style.display = "none";
        }
      
    }

    function saveCalc() {
      let pp = document.getElementById('purchasePrice').value;
      let dep = document.getElementById('dep').value;
      let term = (document.getElementById('term').value)*12;
      let r = (document.getElementById('r').value)/100/12;
      let name = (document.getElementById('name').value);
      let above = r*(pp-dep);
      let below = 1-Math.pow((1+r),(-1*term));
      let ans = above/below;
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
      /**handleSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  const item = {
    title: this.state.currentItem,
    user: this.state.username
  }
  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: ''
  });
} */
    }
    
    return (<div className="comptext">
      <h2>Fixed term mortgage calculator</h2><br></br>
      <img src={calcImg}></img><br></br>
      <input type="number" id='purchasePrice' placeholder='purchase price'></input><br></br>
      <input type="number" id='dep' placeholder='deposit'></input><br></br>
      <input type="number" id='term' placeholder='bond term (years)'></input><br></br>
      <input type="number" id='r' placeholder='fixed interest rate (yearly)'></input><br></br>
      <button id="calc" onClick={doCalc}>CALCULATE</button><br></br>
      <p id='z'>Your monthly payment is:</p><br></br>
      <input type="text" id='name' placeholder='calculation name'></input><button id="calc" onClick={saveCalc}>SAVE</button><br></br>
      <button id="toggleTable" onClick={toggleTable}>TOGGLE TABLE</button><br></br>
      {/* </div><table style="width:100%" id="ex-table"> */}
      
      <div id = "table">
        <table id="savedCalcs" >
          <thead>
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
      <script>toggleTable()</script>
      </div>

    </div>)
    
    }
}
