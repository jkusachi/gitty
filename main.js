/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');

const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const Tray = electron.Tray;
const shell = electron.shell;

var Positioner = require('electron-positioner');
var storage = require('electron-json-storage');
var appIcon;

let menu;
let template;
var mainWindow = null;
var cornerWindow = null;

var isDarwin = (process.platform === 'darwin');
var isLinux = (process.platform === 'linux');
var isWindows = (process.platform === 'win32');

crashReporter.start();

const hasSetup = false;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  //appIcon.setToolTip('Gitty');
  //appIcon.setContextMenu(contextMenu);

  //check storage somewhere by userid?
  //check local storage?

  var value = new Promise(function(resolve, reject){
    return storage.get('repositories', function(err, data){
    if(err) reject(err);
    resolve(data);
    });
  })
  .then(function(data){

    if(data.length){
      start();
    }else{
      loadSetup();
    }

    return data;
  });

});


var loadSetup = function(event){

  if(cornerWindow){
    cornerWindow.close();
  }

  mainWindow = new BrowserWindow({ width: 800, height: 850, frame: true });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.on('closed', () => {
    console.log('Action::closed');
    mainWindow = null;
  });

  ipc.on('app-quit', function() {
    console.log('Action::app quit');
    app.quit();
  });

  if (process.env.NODE_ENV === 'development') {
    //mainWindow.openDevTools();
  }

}

var start = function(event){

  if(mainWindow){
    mainWindow.close();
  }

  appIcon = new Tray( path.join( __dirname, '/images/gitty-icon-50.png' ));

   var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);

 appIcon.on('click', function(e){
  console.log('menu click ', e, arguments);
 })

  cornerWindow = new BrowserWindow({
    width: 600,
    height: 200,
    show: false,
    resizable: false,
    skipTaskbar: true,
    frame: false });
  cornerWindow.on('closed', function(){
     cornerWindow = null;
     appIcon.destroy();
  });

  cornerWindow.openDevTools();
  cornerWindow.loadURL(`file://${__dirname}/app/app.html#repositories`);
  cornerWindow.show();

  var positioner = new Positioner(cornerWindow);
  positioner.move('topRight');

}




ipc.on('setup', loadSetup);

ipc.on('start', start);
