'use strict';

var ipcMain = require('electron').ipcMain;

var path = require('path');
var storage = require('electron-json-storage');
var simpleGit = require('simple-git');

var _ = require('lodash');

class RepositoryProcess {

  constructor(){

  }

  set(paths, renderWindow){
    this.paths = paths;
    this.window = renderWindow;
  }

  getStatus(){
    return () => {
      console.log('gettings tatus');
      _.map(this.paths, (repoPath, index) => {
         simpleGit( path.resolve(repoPath))
        .status((err, status)=>{

          //send status update
          this.window.webContents.send('statusUpdate', {
            index: index,
            status: status
          });
        });
      })
    }
  }

}


module.exports = RepositoryProcess;
