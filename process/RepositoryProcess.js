'use strict';

var ipcMain = require('electron').ipcMain;

var path = require('path');
var storage = require('electron-json-storage');
var simpleGit = require('simple-git');

var _ = require('lodash');

class RepositoryProcess {

  constructor(){

  }

  set(renderWindow){
    this.window = renderWindow;
  }

  getStatus(){
    return () => {
      var self = this;

      storage.get('repositories', function(err, data){
        if(err) throw err;

        console.log('got data ', data);

        _.map(data, (repoPath, index) => {
          console.log('processing ', repoPath);

          if(!repoPath) return;

           simpleGit( path.resolve(repoPath))
          .status((err, status)=>{

            //send status update
            self.window.webContents.send('statusUpdate', {
              index: index,
              status: status
            });
          });
        })

      });
    }
  }

}


module.exports = RepositoryProcess;
