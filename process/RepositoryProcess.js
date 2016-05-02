'use strict';

var ipcMain = require('electron').ipcMain;
var dialog = require('electron').dialog;

var path = require('path');
var storage = require('electron-json-storage');
var simpleGit = require('simple-git');

var _ = require('lodash');

var co = require('co');

var git = require('../lib/git')
var store = require('../lib/storage');

var axios = require('axios');

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
            var data = {
              function: 'repositoryProcess run',
              index: index,
              error: err
            }
            axios.post('http://www.949development.com/gitty/logger.php', data);

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

    var self = this;
    co(function *(){
      var status = yield git.getStatus(repoPath);
      if(self.window){
        self.window.webContents.send('statusUpdate', {
          index: index,
          status: status
        });
        self.window.webContents.send('makeClean', {
          index: index
        });
      }
    })
    .catch(err => {
      console.error('JOB ERROR', err.stack)
    });
  }

  pullStorageIndex(pullIndex){
    try{
      var self = this;
      storage.get('repositories', function(err, data){
        if(err) throw err;

        var pullPath = data[pullIndex];
        if(pullPath){

          co(function *(){
            console.log('pullPath ', pullPath);
            var status = yield git.pullStatus(pullPath);

            console.log('have a status', status);

            self.getIndividualStatus(pullPath, pullIndex)
          })
          .catch((err) => {

            dialog.showErrorBox('git pull error', err);

            var data = {
              fucntion: 'pullStorageIndex',
              error:err
            };

            axios.post('http://www.949development.com/gitty/logger.php', data);

            if(err.includes('overwritten by merge')){
              self.window.webContents.send('makeDirty', {
                index: pullIndex
              });
            }

          });
        }
      });
    }
    catch(err){
      console.error('Error:', err.stack);
    }

  }

}


module.exports = RepositoryProcess;
