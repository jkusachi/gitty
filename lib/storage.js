

var storage = require('electron-json-storage');



module.exports = {


  get: function(key){
    return new Promise(function(resolve, reject){
      storage.get('repositories', function(err, data){
        if(err){ reject(err) }

        return resolve(data);
      })
    })
  }
}


