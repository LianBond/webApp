import React, { Component } from 'react';
import logo from './logo8.svg';
import './App.css';
import CalcComponent from './CalcComponent'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to The Financial Calculator WebApp</h1>
        </header>
        <p className="App-intro">
          This is a homework project for a lifecheq developer position
        </p>
        <hr></hr>
        <CalcComponent displaytext="First Component Data"/>
      </div>
);
  }
}
export default App;
