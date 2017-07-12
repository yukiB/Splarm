import React from 'react'
const electron = window.require('electron');
const {ipcRenderer} = electron;

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      setting: false
    };
  }

  clickHandler() {
    //ipcRenderer.sendSync('asynchronous-message', 'end');
    ipcRenderer.send('end', 'end');
  }

  render() {
    let {loading, setting} = this.state;
    let i = 0;
    return(
      <div id="content">
        Electron MenuBar React Template
        <div id="quit" onClick={this.clickHandler.bind(this)}>quit</div>
      </div>
    );
    }
}

