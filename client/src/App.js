import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Socket} from "phoenix";
let socket = new Socket("ws://localhost:4000/socket")

socket.connect()

let channel = socket.channel("deck:main", {})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

function send() {
  channel.push("new_msg", {body: "hello"})
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
