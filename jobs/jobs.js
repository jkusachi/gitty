'use strict';

class Job {

  constructor(interval){
    this.interval = null;
  }

  start(timeout){

    this.intervalFn.call(this);

    console.log('STARTING JOB ---- ', timeout);
    this.interval = setInterval(this.intervalFn, timeout || 5000);
  }

  runImmediate(){
    console.log('running job immediately');
    this.intervalFn.call(this);
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
