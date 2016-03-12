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
    this.window = renderWindow || null;
  }

  getStatus(){
    console.log('JOB - getStatus()');
    return () => {
      console.log('JOB - running job');
      var self = this;

      try{
        storage.get('repositories', function(err, data){
          if(err) throw err;

          _.map(data, (repoPath, index) => {

            if(!repoPath) return;

             simpleGit( path.resolve(repoPath))
            .status((err, status)=>{
              if(err) throw err;
              //send status update
              if(self.window){
                self.window.webContents.send('statusUpdate', {
                  index: index,
                  status: status
                });
              }
            });
          })

        });
      }
      catch(err){
        console.error('JOB ERROR', err.stack)
      }
    }
  }

  pullStorageIndex(pullIndex){

    try{
      var self = this;
      storage.get('repositories', function(err, data){
        if(err) throw err;

        var pullPath = data[pullIndex];
        if(pullPath){
          simpleGit(pullPath)
          .pull(function(err, update){
            if(update && update.summary.changes){
              self.window.webContents.send('makeClean', {
                index: pullIndex
              })
            }
            else if(!update){
              self.window.webContents.send('makeDirty', {
                index: pullIndex
              })
            }
          })
        }
      });
    }
    catch(err){
      console.error('Error:', err.stack);
    }

  }

}


module.exports = RepositoryProcess;
