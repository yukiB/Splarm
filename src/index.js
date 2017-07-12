'use strict'

const path = require('path')
var menubar = require('menubar')
const {ipcMain, app} = require('electron')

var mb = menubar({index: path.join('file://', __dirname, '/index.html'), width:300, height:250, preloadWindow:true})

mb.on('ready', function ready() {
  console.log('app is ready')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  console.log('tmp')
  event.returnValue = 'pong'
})

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);
  //event.sender.send('asynchronous-reply', 'pong')
})


ipcMain.on('end', (event, arg) => {
  console.log(arg);
  app.quit();
})
