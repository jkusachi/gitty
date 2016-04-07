'use strict';

class Job {

  constructor(interval){
    this.interval = null;
  }

  start(timeout){
    console.log('STARTING JOB ---- ');
    this.interval = setInterval(this.intervalFn, timeout || 5000);
  }

  set(fn){
    console.log('JOB SET');
    console.log('fn');
    console.log(fn);

    this.intervalFn = fn;
  }

  stop(){
    console.log('STOPPING JOB ---- ');
    clearInterval(this.interval);
  }
}


module.exports = Job;
