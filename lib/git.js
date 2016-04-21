
var path = require('path');
var simpleGit = require('simple-git');


module.exports = {

  getStatus: function(repoPath){
    return new Promise(function(resolve, reject){
      console.log('processing ', repoPath);
      simpleGit( path.resolve(repoPath))
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
      simpleGit(repoPath)
      .pull(function(err, update){
        if(err) reject(err);
        if(update && update.summary.changes){
          resolve(update)
        }
        else if(!update){
          reject(err);
        }

      })
    })

  }

}
