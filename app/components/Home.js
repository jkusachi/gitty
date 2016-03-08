import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';

const dialog = require('electron').remote.dialog;

var path = require('path');

console.log('styles ', styles);

export default class Home extends Component {

  onClick(){
    console.log('clicked');
    dialog.showOpenDialog({
      properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    }, function(pathArray){
      let path = pathArray[0];
      console.log('path is ', path);
    });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src="../images/gitty-icon-color.png"  width="250" />
          </div>

          <strong className={styles.title}>Gitty!</strong>
          <p className={styles.desc}>Gitty is an open-source menu bar tool for OS X that keeps you informed on the status of
          your local repositories.  Primarily geared towards microservice based projects, it will
          let you know how far ahead or behind a specific branch you are.  Sync all at once or individually,
          it's your call.  </p>

          <button onClick={this.onClick.bind(this)}>Add Repositories</button>

          <p className={styles.credits}>By James</p>

        </div>
      </div>
    );
  }
}

