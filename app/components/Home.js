'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import path from 'path';
import {remote} from 'electron';

import _ from 'lodash';

import Repositories from './Repositories/Repositories';

var {dialog} = remote;

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

  onClear(){
    console.log('clearing');
    var { clearRepositories } = this.props;
    clearRepositories();
  }

  render() {

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.image}>
            <img src="../images/gitty-icon-color.png"  width="200" />
          </div>

          <strong className={styles.title}>Gitty!</strong>
          <p className={styles.desc}>Gitty is an open-source menu bar tool for OS X that keeps you informed on the status of
          your local repositories.  Primarily geared towards microservice based projects, it will
          let you know how far ahead or behind a specific branch you are.  Sync all at once or individually,
          it's your call.  </p>

          <button onClick={this.onClick.bind(this)}>Add Repositories</button>

          <If condition={!_.isEmpty(this.props.setup.repos)}>
            <button className={styles.start}>Start er' up</button>
          </If>

          <Repositories
            onClear={this.onClear.bind(this)}
            items={this.props.setup.repos}
           />

          <p  className={styles.credits}>By James</p>

        </div>
      </div>
    );
  }
}


export default Home;
