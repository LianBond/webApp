import React, {Component} from 'react';
import calcImg from './calcImg.svg';
import fb from './firebase.js';
import './calcComp.css';
import SavedCalculationsComponent from './SavedCalculationsComponent';

export default class CalcComponent extends Component {

constructor(props) {
    super(props)
    }

render() {
      
      function doCalc() {
        let pp = document.getElementById('purchasePrice').value;
        let dep = document.getElementById('dep').value;
        let term = (document.getElementById('term').value)*12;
        let r = (document.getElementById('r').value)/100/12;
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
          document.getElementById('z').innerHTML = 'Your monthly payment is: R'+ans;

          let loanAmount = pp-dep;
          let afterNMonth = loanAmount*(1+r)-ans;
          let percentagePaidToCapital = ((loanAmount-afterNMonth)/loanAmount)*100;
          let percentagePaidToInterest = 100 - percentagePaidToCapital;
          console.log(percentagePaidToCapital);
        } else {
          alert('Math Error. Please input valid values')
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
          <label for="r">fixed interest rate (yearly %)</label><br></br>
          <input type="number" id='r' placeholder='fixed interest rate (yearly)'></input>
        </div>
        <div class="form-group">
          <button class="submit" type="button" onClick={doCalc}>CALCULATE</button>
          <p id='z'>Your monthly payment is:</p>
        </div>
        </div>
        </form>
          <input type="text" id='name' placeholder='calculation name'></input>
          <button id="calc" onClick={saveCalc}>SAVE</button>
      
      <SavedCalculationsComponent></SavedCalculationsComponent>

    </div>)
    
    }
}
