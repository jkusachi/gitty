'use strict';

class Job {

  constructor(interval){
    this.interval = null;
  }

  start(timeout){
    //this.interval = setInterval(this.intervalFn, timeout || 5000);

    console.log('fn ', this.intervalFn);
    setImmediate(this.intervalFn);
    //this.intervalFn.call(this);
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
