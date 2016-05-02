
var path = require('path');
var simpleGit = require('simple-git');


module.exports = {

  getStatus: function(repoPath){
    return new Promise(function(resolve, reject){
      console.log('processing ', repoPath);
      var instance = simpleGit( path.resolve(repoPath) );

      instance
      .customBinary('/usr/bin/git')
      .fetch((err) => {
        if(err) reject(err);
      })
      .status( (err, status)=>{
        if(err) reject(err)
        resolve(status);

      })
    })
  },


  pullStatus(repoPath){

    return new Promise(function(resolve, reject){
      var instance = simpleGit( path.resolve(repoPath) );

      instance
      .customBinary('/usr/bin/git')
      .pull(function(err, update){
        if(err) reject(err);

        if(update && ( update.summary.changes || update.summary.changes === 0 )){
          resolve(update)
        }
        else if(!update){
          reject(err);
        }

      })
    })

  }

}
