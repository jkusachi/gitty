'use strict';

class Job {

  constructor(interval){
    console.log('creating new job');
    this.interval = null;
  }

  start(timeout){
    this.interval = setInterval(this.intervalFn, timeout || 5000);
  }

  set(fn){
    this.intervalFn = fn;
  }

  stop(){
    console.log('kill the job!');
    clearInterval(this.interval);
  }
}


module.exports = Job;
