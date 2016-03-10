'use strict';

import {ipcRenderer} from 'electron';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import path from 'path';
import {remote} from 'electron';
import _ from 'lodash';


import Repositories from './Repositories/Repositories';

import storage from 'electron-json-storage';

const {dialog} = remote;
const BrowserWindow = remote.BrowserWindow;


class Home extends Component {

  constructor(props){
    super(props);
    this.getRepos();
  }

  getRepos(){
    var { getRepositories } = this.props;
    getRepositories();
  }

  onClick(){
    var { saveRepositories } = this.props;
    dialog.showOpenDialog({
      properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    }, function(pathArray){
      saveRepositories(pathArray);
    });
  }

  startUp(){

    ipcRenderer.sendSync('start');
  }

  onClear(){
    console.log('clearing');
    var { clearRepositories } = this.props;
    clearRepositories();
  }

  onDelete(){
    console.log('delete');
    storage.remove('repositories');
  }

  render() {

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src="../images/Gitty-Full-Gradient.png"  width="600" />
          </div>

          <p className={styles.desc}>Gitty is an open-source menu bar tool for OS X that keeps you informed on the status of
          your local repositories.  Primarily geared towards microservice based projects, it will
          let you know how far ahead or behind a specific branch you are.  Sync all at once or individually,
          it's your call.  </p>

          <div className={styles.buttons}>
            <button onClick={this.onClick.bind(this)}>Add Repositories</button>

            <If condition={!_.isEmpty(this.props.repositories.repos)}>
              <button onClick={this.startUp.bind(this)} className={styles.start}>Start er' up</button>
            </If>
          </div>



          <Repositories
                onClear={this.onClear.bind(this)}
                items={this.props.repositories.repos}
               />

          <p  className={styles.credits}>By James</p>

        </div>
      </div>
    );
  }
}


export default Home;

