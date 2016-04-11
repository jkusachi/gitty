/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
var _ = require('lodash');

var Job = require('./jobs/jobs');
var RepositoryProcess = require('./process/RepositoryProcess');

const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const Tray = electron.Tray;
const shell = electron.shell;
const dialog = electron.dialog;

var Positioner = require('electron-positioner');
var storage = require('electron-json-storage');
var appIcon;
var positioner; //holds cornerWindow position

var open = require('mac-open');

let menu;
let template;
var mainWindow = null;
var cornerWindow = null;

var isDarwin = (process.platform === 'darwin');
var isLinux = (process.platform === 'linux');
var isWindows = (process.platform === 'win32');

crashReporter.start();

const ITEM_HEIGHT = 60;
const ITEM_HEIGHT_EXTRAS = 45;
const hasSetup = false;




var job = new Job();
var repoProcess = new RepositoryProcess();

//killswitch the app
const doKill = false;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  //killswitch
  if(doKill){
    storage.remove('updateInterval');
    storage.remove('repositories');
    return;
  }

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
  console.log('loadSetup');

  if(cornerWindow){
    cornerWindow.close();
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 850,
    frame: false,
    title: 'Gitty'
  });
  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipc.on('app-quit', function() {
    app.quit();
  });

  if (process.env.NODE_ENV === 'development') {
    //mainWindow.openDevTools();
  }

}

var start = function(event){

  console.log('start');

  if(mainWindow){
    mainWindow.close();
  }

  appIcon = new Tray( path.join( __dirname, '/images/gitty-icon-20.png' ));

   var template = [
    {
      label: 'Show Repositories',
      type: 'normal',
      click: function(item, focusedWindow){
        cornerWindow.show();
      }
    },
    {
      label: 'Hide Repositories',
      type: 'normal',
      click: function(){
        cornerWindow.hide();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Sync Now',
      type: 'normal',
      click: function(item, focusedWindow){
        refreshRepositories();
      }
    },
    {
      type: 'separator'
    },

    {
      label: 'Update Repositories',
      submenu: [
        {
          label: 'Every 10 Seconds',
          type: 'radio',
          click: function(event, index){
            var interval = 10000;
            storage.set('updateInterval', interval, function(){
              restartJob(interval);
            });
          },
          value: 10000
        },
        {
          label: 'Every 1 minute',
          type: 'radio',
          click: function(event, index){
            var interval = 60000;
            storage.set('updateInterval', interval, function(){
              restartJob(interval);
            });
          },
          value: 60000
        },
        {
          label: 'Every 5 Minutes',
          type: 'radio',
          click: function(event, index){
            var interval = 300000;
            storage.set('updateInterval', interval, function(){
              restartJob(interval);
            });
          },
          value: 300000
        },
        {
          label: 'Every 10 Minutes',
          type: 'radio',
          click: function(event, index){
            var interval = 600000;
            storage.set('updateInterval', interval, function(){
              restartJob(interval);
            });
          },
          value: 600000
        },
        {
          label: 'Every 30 Minutes',
          type: 'radio',
          click: function(event, index){
            var interval = 1800000;
            storage.set('updateInterval', interval, function(){
              restartJob(interval);
            });
          },
          value: 1800000
        }
      ]

    },

    {
      type: 'separator'
    },
    {
      label: 'Add Repositories',
      type: 'normal',
      click: onAddRepository
    },
    {
      type: 'separator'
    },
    {
      label: 'Move Window',
      submenu: [
        {
          label: 'Top Left',
          click: function(event, index){
            if(cornerWindow && positioner){
              positioner.move('topLeft');
            }
          }
        },
        {
          label: 'Top Right',
          click: function(event, index){
            if(cornerWindow && positioner){
              positioner.move('topRight');
            }
          }
        },
        {
          label: 'Bottom Left',
          click: function(event, index){
            if(cornerWindow && positioner){
              positioner.move('bottomLeft');
            }
          }

        },
        {
          label: 'Bottom Right',
          click: function(event, index){
            if(cornerWindow && positioner){
              positioner.move('bottomRight');
            }
          }
        }
      ]
    },
    {
      label: 'Set External Opener',
      submenu: [
        {
          label: 'Terminal',
          click: function(){
            storage.set('terminal', 'terminal');
          }
        },
        {
          label: 'iTerm',
          click: function(){
            storage.set('terminal', 'iterm');
          }
        },
        {
          label: 'Sublime Text',
          click: function(){
            storage.set('terminal', 'Sublime Text');
          }
        },
        {
          label: 'Sublime Text 2',
          click: function(){
            storage.set('terminal', 'Sublime Text 2');
          }
        }
      ]
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click: function(){
        app.quit();
      }
    },
  ];

  //create the corner window
  cornerWindow = new BrowserWindow({
    width: 650,
    height: 200,
    show: false,
    resizable: true,
    skipTaskbar: true,
    title: 'Gitty',
    frame: false });
  cornerWindow.on('closed', function(){
     cornerWindow = null;
     appIcon.destroy();
  });

  if (process.env.NODE_ENV === 'development') {
    cornerWindow.openDevTools();
  }
  cornerWindow.loadURL(`file://${__dirname}/app/app.html#repositories`);
  cornerWindow.setMenuBarVisibility(false);
  cornerWindow.show();

  positioner = new Positioner(cornerWindow);
  positioner.move('topRight');

  cornerWindow.on('closed', () => {
    job.stop();
  })

  cornerWindow.on('blur', function(){
    //cornerWindow.hide();
  })

  storage.get('updateInterval', function(err,data){

    var updateIndex;
    var checkValue;
    if(err) throw err;

    if(data && _.isInteger(data)){
      checkValue = data;
    }else{
      checkValue = 600000;
    }
    updateIndex = _.findIndex(template[5].submenu, {value: checkValue})

    template[5].submenu[updateIndex].checked = true;
    var contextMenu = Menu.buildFromTemplate(template);
    appIcon.setContextMenu(contextMenu);
  });


  storage.get('repositories', function(err,data){
    console.log('-- repositories');

    var paths = data;
    cornerWindow.setSize(650, calculateHeight(paths.length) );


    storage.get('updateInterval', function(err, data){
      if(err) throw err;


      repoProcess.set(cornerWindow);
      job.set( function(){
        repoProcess.run();
      });

      startJob(data);
    })
  });

}
/**
 Starts a Job
**/
const startJob = function(data){
  console.log('----');
  console.log('startJob', data);
  var interval = _.isEmpty(data) ? 600000 : data;

  console.log('starting job interval: ', interval);
  job.start(data);
}


/**
 Retarts a Job
**/
const restartJob = function(data){
  console.log('----------');
  console.log('restartJob!', data);

  job.stop();
  job.start(data);
}


const refreshRepositories  = function(evt, index){
  console.log('refreshRepositories');

  if(repoProcess){

    storage.get('repositories', function(err, data){
      if(cornerWindow){
        repoProcess.set(cornerWindow);

        if(Array.isArray(data) && data.length){
          console.log('YES');
          cornerWindow.setSize(650, calculateHeight(data.length))
        }else{
          console.log("NO");
        }
      }
      //repoProcess.run(data || []);
      job.runImmediate();

    })

  }
}

const onAddRepository = function(event, index){
  console.log('onAddRepository')
  dialog.showOpenDialog({
    properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
  }, function(pathArray){
    if(pathArray){
      cornerWindow.webContents.send('addRepositories', pathArray);
    }
  });

}

const calculateHeight = function(numItems){
  return numItems * ITEM_HEIGHT;
}


/**
 * Called when we want to refresh repositories
 */
ipc.on('refreshRepositories', refreshRepositories);


ipc.on('setup', loadSetup);

ipc.on('start', start);

/**
 * Resizes corner window
 */
ipc.on('resizeCornerWindow', function(event){
  storage.get('repositories', function(err,data){
    var paths = data;
    if(cornerWindow){
      cornerWindow.setSize(650, calculateHeight(paths.length) );
    }
  });
})

/**
 * Message called in React App Initialization
 */
ipc.on('react-app-started', function(event, index){

});


/**
 * Git Pull a repo on a specific index
 */
ipc.on('git-pull', function(event, index){

  //var gitProcess = new RepositoryProcess();
  repoProcess.set(cornerWindow);
  repoProcess.pullStorageIndex(index);

})


/**
 * Opens a Terminal
 */
ipc.on('openTerminal', function(event,path){

  storage.has('terminal', function(err,hasData){
    if(hasData){
      storage.get('terminal', function(err,data){
        open(path, { a: data });
      })
    }else{
      open(path, { a: "Terminal" });
    }
  })
  storage.get('terminal', function(err,data){
    if(err) throw err;
  });
})

