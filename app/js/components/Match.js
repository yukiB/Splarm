"use strict";

import React from 'react'
const electron = window.require('electron');
const {ipcRenderer} = electron;

const toDate = (time) => {
  let objDate = new Date(time);
  let res = objDate.getFullYear() + "/" + (objDate.getMonth()+1) + "/" + ("0" + objDate.getDate()).slice(-2) + " ";
  res += ("0" + objDate.getHours()).slice(-2) +":" + ("0" + objDate.getMinutes()).slice(-2);
  return res;
}

export class MatchContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }
  render() {
    let {typeName, stages} = this.props;
    return(
      <div className="match-content">
        <p className="type-name">{"【" + typeName + "】"}</p>
        <p className="place">{stages.join(', ')}</p>
      </div>
    );
  }
}

const setNotifcation = (match, setTimer) => {
  let now = new Date();
  let  time = (match[1].start - now.getTime());
  setTimer(time + 10 * 1000);
  let n = new Notification("【" + match[0].rule + "】", {body: match[0].ranked.join(', '), timeout: 2000});
  
}

export default class Match extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nowId: 0,
      size: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({nowId: 0});
    let match = nextProps.data.match;
    if (match) {
      this.setState({size: match.length});
      setNotifcation(match, this.props.setTimer);
    }
  }

  componentDidMount() {
    let match = this.props.data.match;
    if (match) {
      this.setState({size: match.length});
      setNotifcation(match, this.props.setTimer);
    }
  }

  upHandler() {
    let {nowId, size} = this.state;
    if (nowId - 1 > -1)
      this.setState({nowId: nowId - 1});
  }

  downHandler() {
    let {nowId, size} = this.state;
    ipcRenderer.send('print-message', size);
    if (nowId + 1 < size) {
      this.setState({nowId: nowId + 1});
    }
  }
  
  render() {
    let {data} = this.props,
        {nowId, size} = this.state,
        nowMatch = data.match ? data.match[nowId] : null,
        upActive = nowId != 0,
        downActive = nowMatch && nowId != size - 1;
    let matches = nowMatch ? 
                  <div id="match-block">
                    <MatchContent typeName={nowMatch.rule} stages={nowMatch.ranked} />
                    <MatchContent typeName={"ナワバリ"} stages={nowMatch.regular} />
                    <div id="up" onClick={this.upHandler.bind(this)} className={upActive ? "active_button" : null}>{upActive ? "▲" : "△"}</div>
                    <div id="down" onClick={this.downHandler.bind(this)} className={downActive ? "active_button" : null}>{downActive ? "▼" : "▽"}</div>
                  </div> : null;
    
    return(
      <div>
        <div className="now-time">{nowMatch ? toDate(nowMatch.start) : null}</div>
        {matches}
      </div>
    );
  }
}

