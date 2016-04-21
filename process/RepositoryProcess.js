'use strict';

var ipcMain = require('electron').ipcMain;

var path = require('path');
var storage = require('electron-json-storage');
var simpleGit = require('simple-git');

var _ = require('lodash');

var co = require('co');

var git = require('../lib/git')
var store = require('../lib/storage');

function getElapsed(start, end){

  console.log('start -- ', start);
  console.log('end -- ', end);
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
    console.log('RepositoryProcess::set');
    this.window = renderWindow || null;
  }

  run(){

    if(!this.timer){
      this.timer = new Date();
    }
    var now = new Date();

    var elapsed = getElapsed(this.timer, now);
    console.log('-- JOB running');
    console.log(elapsed.minutes + ' minutes, ' + elapsed.seconds +' seconds since last ran');

    this.timer = now;
    var self = this;

    try{

      co(function *(){
        var repositories = yield store.get('repositories');
        return repositories;
      })
      .then( function(repositories){

        _.map(repositories, (repoPath, index) => {
          if(!repoPath) return;

          co(function *(){

            var status = yield git.getStatus( repoPath  );

            if(self.window){
              self.window.webContents.send('statusUpdate', {
                index: index,
                status: status
              });
            }

          })
          .catch( err => {
            console.log('Invalid Repo for Index: ', index, ' with status: ', err);
            if(self.window){
              self.window.webContents.send('statusUpdate', {
                index: index,
                status: { isInvalid: true}
              });
            }
          });

        })
      });

    }
    catch(err){
      console.log('error - ', err);
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
