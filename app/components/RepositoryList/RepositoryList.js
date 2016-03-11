'use strict';

import {ipcRenderer} from 'electron';
import {remote} from 'electron';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RepositoryList.css';
import path from 'path';
import _ from 'lodash';

import RepositoryListItem from './RepositoryListItem';

const {dialog} = remote;

export default class RepositoryList extends Component {

  constructor(props){
    super(props);

    var { getRepositories, saveStatus } = this.props;
    getRepositories();

    ipcRenderer.on('statusUpdate', (evt,message) => {
      saveStatus(message);
    });

  }

  onAddRepository(){

    var { saveRepositories } = this.props;
    dialog.showOpenDialog({
      properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    }, function(pathArray){
      saveRepositories(pathArray);
    });

  }

  onClear(){
    var { clearRepositories } = this.props;
    clearRepositories();
  }

  render() {
    return (
      <div className={styles.container}>

        <If condition={this.props.repositories}>
          {_.map(this.props.repositories.repos, function(item){
            return ( <RepositoryListItem data={item} /> );
          })}
        </If>

        <div className={styles.addRepository}>
          <button onClick={this.onAddRepository.bind(this)}>+</button>
        </div>

        <div className={styles.mainActions}>
          <button onClick={this.onClear.bind(this)}>clear repositories</button>
        </div>

      </div>
    );
  }

}

