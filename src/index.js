'use strict'

const splainfo = require('./splainfo')

const path = require('path')
const menubar = require('menubar')
const {ipcMain, app} = require('electron')

var mb = menubar({index: path.join('file://', __dirname, '/index.html'), width:300, height:200, preloadWindow:true})

mb.on('ready', function ready() {
  console.log('app is ready')
})

ipcMain.on('synchronous-message', (event, arg) => {
  //event.returnValue = 'pong'
})

ipcMain.on('print-message', (event, arg) => {
  console.log(arg);
})

ipcMain.on('splainfo', (event, arg) => {
  let si = splainfo();
  si.on('done', () => {
    let res = {}
    res.fes_state = -1;
    res.match = [{regular: si.regular, start: si.starttime, end: si.endtime, ranked: si.ranked, rule: si.ranked_rule},
                 {regular: si.next_regular, start: si.next_starttime, end: si.next_endtime, ranked: si.next_ranked, rule: si.next_ranked_rule}];
    event.sender.send('splainfo-reply', JSON.stringify(res));
  })
})

ipcMain.on('end', (event, arg) => {
  app.quit();
})
