'use strict';

var _ = require('lodash');

class Job {

  constructor(interval){
    console.log('Job::__constructor');
    this.interval = null;
  }

  start(timeout){

    //this.intervalFn.call(this);

    timeout = _.isInteger(timeout) ? timeout : 600000;

    console.log('Job::start');
    console.log('STARTING JOB ---- ', timeout);
    this.interval = setInterval(this.intervalFn, timeout);
  }

  runImmediate(){
    console.log('Job::runImmediate');
    this.intervalFn.call(this);
  }

  set(fn){
    console.log('Job::set');

    this.intervalFn = fn;
  }


  stop(){
    console.log('Job::stop');
    console.log('STOPPING JOB ---- ');
    clearInterval(this.interval);
  }
}


module.exports = Job;
