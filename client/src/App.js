import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Socket} from "phoenix";
let socket = new Socket("ws://localhost:4000/socket")

socket.connect()

let channel = socket.channel("deck:main", {})

channel.on("new_msg", payload => {
  console.log(payload);
})

let i = 0
channel.join()
  .receive("ok", resp => { i = JSON.parse(resp.body).a1 })
  .receive("error", resp => { console.log("Unable to join", resp) })

function send() {
  i = i + 1;
  channel.push("new_msg", {body: JSON.stringify({a1: i})})
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <button onClick={send}>click</button>
      </div>
    );
  }
}

export default App;
