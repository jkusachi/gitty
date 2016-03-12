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

    var {
        addRepositories,
        getRepositories,
        saveStatus
    } = this.props;

    getRepositories();

    ipcRenderer.on('statusUpdate', (evt,message) => {
      saveStatus(message);
    });

    ipcRenderer.on('addRepositories', function(evt, message){
      addRepositories(message);
    })

    ipcRenderer.on('makeDirty', (evt,message) => {
      var { setDirty } = this.props;
      setDirty(message.index, true);
    });

    ipcRenderer.on('makeClean', (evt,message) => {
      var { setDirty } = this.props;
      setDirty(message.index, false);
    });

  }

  onAddRepository(){

    var { addRepositories } = this.props;
    dialog.showOpenDialog({
      properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
    }, function(pathArray){
      if(pathArray){
        addRepositories(pathArray);
      }
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
          {_.map(this.props.repositories.repos, (item, index) => {
            return ( <RepositoryListItem
                        data={item}
                        key={index}
                        isDirty={item.isDirty}
                        index={index}/> );
          })}
        </If>

        {/*
        <div className={styles.addRepository}>
          <button onClick={this.onAddRepository.bind(this)}>+ add repository</button>
        </div>

        <div className={styles.mainActions}>
          <button onClick={this.onClear.bind(this)}>clear repositories</button>
        </div>
        */}

      </div>
    );
  }

}

