'use strict';

class Job {

  constructor(interval){
    this.interval = null;
  }

  start(timeout){
    console.log('starting job', timeout);
    this.interval = setInterval(this.intervalFn, timeout || 5000);
  }

  set(fn){
    console.log('setting functi');
    this.intervalFn = fn;
  }

  stop(){
    console.log('kill the job!');
    clearInterval(this.interval);
  }
}


module.exports = Job;
