"use strict";

import React from 'react'
import Match from './Match'
const electron = window.require('electron');
const {ipcRenderer} = electron;

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: false,
      data: {}
    };
  }

  clickHandler() {
    ipcRenderer.send('end', 'end');
  }

  reload() {
    this.setState({loading: true});
    ipcRenderer.send('splainfo', '');
  }

  componentDidMount() {

    ipcRenderer.on('splainfo-reply', (event, arg) => {
      let data = JSON.parse(arg);
      //ipcRenderer.send('print-message', data.match[0]);
      this.setState({loading: false, data: data});
    });
    this.reload();
  }

  getTimer(time) {
    setTimeout(() => {ipcRenderer.send('splainfo', '')}, time);
  }

  render() {
    let {loading, error, data} = this.state;
    let i = 0;
    let cont = loading ? <div>loading...</div> : (error ?  <div>Error! Please try later...</div>  : <Match data={data} setTimer={this.getTimer.bind(this)}/>);
    return(
      <div id="content">
        <div id="reloading" className={loading ? "rotateobj" : null} onClick={this.reload.bind(this)}></div>
        {cont}
        <div id="quit" onClick={this.clickHandler.bind(this)}>quit</div>
      </div>
    );
    }
}

