import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  state = { colors: [
    { name: '', r: '', g: '', b: '', color: '' }
  ]}

 componentDidMount() {
    fetch('/colors')
      .then(res => res.json())
      .then(data => this.setState({ colors: data }))
      .catch(error => console.log(error));
  }


  render() {
    return (
      <div className="App" >
        <div className="App-header">
        {this.state.colors.map(
          (color,i) =>
          
            <div key={i}>
              <div id="circle" style={{backgroundColor: color.color}}></div>
              <p className="colorName">{color.name}</p>
            </div>
          
        )}
        </div>
      </div>
    )
  }
}

export default App;
