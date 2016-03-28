'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RepositoryList.css';
import path from 'path';
import _ from 'lodash';
import cx from 'classnames';

import {ipcRenderer} from 'electron';
import {remote} from 'electron';

import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import open from 'mac-open';

import * as repoActions from '../../actions/repositories' ;

class RepositoryListItem extends Component {

  constructor(props){
    super(props);
  }

  onDeleteRepository() {
    var {removeRepository} = this.props
    removeRepository(this.props.index);
  }

  onGitPull(){

    var {setItemLoading} = this.props;
    setItemLoading(this.props.index);

    ipcRenderer.send('git-pull', this.props.index)
  }

  onTerminal(){

    ipcRenderer.send('openTerminal', this.props.data.path)
  }

  render() {

    var {path, status, isLoading} = this.props.data;


    var {ahead, behind, current, tracking, isInvalid} = status || {};
    var health;
    //path/to/the/repository

    //gives back just "repository"
    var shortPathName = path.match(/[^/]*$/)[0];

    if(ahead == 0 && behind == 0){
      health = "healthy";
    }else if(ahead < 5 && behind < 5){
      health = 'stomachache';
    }else{
      health = 'flu';
    }


    return (
      <div className={cx(styles.listItem, styles[health])}>
        <div className={styles.contentWrapper}>

          <If condition={isInvalid}>
            <div className={true}>
              <label>{shortPathName} is Invalid</label>
            </div>
          <Else/>
            <div className={true}>
              <label>{shortPathName}
                <If condition={this.props.isDirty}> is Dirty!</If>
              </label>
              <div className={styles.branchInfo}>
                <div className={styles.current}>Local Branch: <span>{current}</span></div>
                <div className={styles.tracking}>-> Tracks Remote: <span>{tracking}</span></div>
              </div>
            </div>
            <div className={styles.buttons}>

              <If condition={!isLoading}>
                <If condition={health !== 'healthy'}>
                  <button onClick={this.onGitPull.bind(this)} className={styles.pull}>git pull</button>
                </If>
              <Else/>
                <div className={styles.isLoading}>
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              </If>
            </div>
            <div className={styles.status}>
              <If condition={health === 'healthy'}>
                <div className={styles.upToDate}>
                  <span>Up to Date!</span>
                </div>
              <Else/>
                <div className={styles.ahead}>+{ahead}</div>
                  <div className={styles.divider}>/</div>
                <div className={styles.behind}>-{behind}</div>
              </If>
            </div>

          </If>


          <i onClick={this.onTerminal.bind(this)} className={cx(styles.externalLink, 'fa fa-external-link')}></i>
          <div className={styles.actions}>
            <i onClick={this.onDeleteRepository.bind(this)} className={cx(styles.actionButton, "fa fa-trash")}></i>
          </div>
        </div>

        <If condition={this.props.isDirty}>
          <div
            style={{background: 'url(../images/dirty.jpg)'}}
            className={styles.isDirty} />
        </If>

      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators(repoActions, dispatch);
}

export default connect(null, mapDispatchToProps)(RepositoryListItem);
