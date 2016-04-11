'use strict';

var ipcMain = require('electron').ipcMain;

var path = require('path');
var storage = require('electron-json-storage');
var simpleGit = require('simple-git');

var _ = require('lodash');

function getElapsed(start, end){

  console.log('getElapsed');
  console.log(start);
  console.log(end);
  var timeDiff = end - start;
  // strip the ms
  timeDiff /= 1000;
  var seconds =  Math.round(timeDiff % 60);

  // remove seconds from the date
  timeDiff = Math.floor(timeDiff / 60);

  // get minutes
  var minutes = Math.round(timeDiff % 60);

  return {
    minutes: minutes,
    seconds: seconds
  }
}

class RepositoryProcess {

  set(renderWindow){
    this.window = renderWindow || null;
  }

  run(){

    if(!this.timer){
      this.timer = new Date();
    }
    var now = new Date();

    var elapsed = getElapsed(this.timer, now);
    console.log('JOB--running');
    console.log(elapsed.minutes + ' minutes, ' + elapsed.seconds +' seconds since last ran');

    this.timer = now;

      var self = this;
      try{
        storage.get('repositories', function(err, data){
          if(err) throw err;

          console.log('--running with ', data.length , ' repos');

          console.log('data? ', data);

          _.map(data, (repoPath, index) => {

            console.log('something? ', repoPath);

            return;

            if(!repoPath) return;
            try{
              simpleGit( path.resolve(repoPath))
              .fetch((err) => {
                //catch invalid repos and set error
                if(err && self.window){
                  self.window.webContents.send('statusUpdate', {
                    index: index,
                    status: {
                      isInvalid: true
                    }
                  });
                  return Promise.reject('reject')
                }else{
                  return Promise.reject('reject')
                }

              })
              .status((err, status)=>{
                if(err) throw err;
                console.log('--Status Retrieved -- for path ', repoPath);
                //console.log('Git Status for: ', repoPath);
                //console.log(status);
                //send status update
                if(self.window){
                  self.window.webContents.send('statusUpdate', {
                    index: index,
                    status: status
                  });
                }
                return Promise.resolve(true);
              });
            }
            catch(err){
              console.log('error ', err);
            }
          })

        });
      }
      catch(err){
        console.error('JOB ERROR', err.stack)
      }

  }

  getIndividualStatus(repoPath, index){

    try{
      simpleGit( path.resolve(repoPath))
      .fetch()
      .status((err, status)=>{
        if(err) throw err;
        console.log('--Individual Status-------------------------');
        console.log('Git Status for: ', repoPath);
        console.log(status);
        if(this.window){
          this.window.webContents.send('statusUpdate', {
            index: index,
            status: status
          });

          this.window.webContents.send('makeClean', {
            index: index
          });
        }
      });
    }
    catch(err){
      console.error('JOB ERROR', err.stack)
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
            console.log('updateeee')
            console.log(update);;

            if(update && update.summary.changes){
              self.getIndividualStatus(pullPath, pullIndex)
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
