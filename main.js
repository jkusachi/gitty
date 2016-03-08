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
const shell = electron.shell;
let menu;
let template;
let mainWindow = null;
const Tray = electron.Tray;

var appIcon;

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

  appIcon = new Tray( path.join( __dirname, '/images/gitty-icon-50.png' ));

   var contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);

  //appIcon.setToolTip('Gitty');
  //appIcon.setContextMenu(contextMenu);

  //check storage somewhere by userid?
  //check local storage?

  if(!hasSetup){

    mainWindow = new BrowserWindow({ width: 800, height: 850, frame: false });

    mainWindow.loadURL(`file://${__dirname}/app/app.html`);

    mainWindow.on('closed', () => {
      mainWindow = null;
      appIcon.destroy();
    });

    ipc.on('app-quit', function() {
      app.quit();
    });

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools();
    }
  }

});
