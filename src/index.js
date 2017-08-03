'use strict'

const splainfo = require('./splainfo')
const splainfo2 = require('./splainfo2')

const path = require('path')
const menubar = require('menubar')
const {ipcMain, app} = require('electron')

var mb = menubar({index: path.join('file://', __dirname, '/index.html'), width:330, height:250, preloadWindow:true})

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
    res.match = [{regular: si.regular, start: si.starttime, end: si.endtime, gachi: si.ranked, gachiRule: si.ranked_rule},
                 {regular: si.next_regular, start: si.next_starttime, end: si.next_endtime, gachi: si.next_ranked, gachiRule: si.next_ranked_rule}];
    //event.sender.send('splainfo-reply', JSON.stringify(res));
  })
})

ipcMain.on('splainfo2', (event, arg) => {
  let si = splainfo2();
  console.log('splainfo2');
  si.on('done', () => {
    console.log('done');
    let res = {};
    res.fes_state = -1;
    res.match = si.data;
    event.sender.send('splainfo-reply', JSON.stringify(res));
  })
})

ipcMain.on('end', (event, arg) => {
  app.quit();
})
