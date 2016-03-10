'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RepositoryList.css';
import path from 'path';
import _ from 'lodash';
import cx from 'classnames';

export default class RepositoryListItem extends Component {

  constructor(props){
    super(props);
  }

  render() {

    var {path, status} = this.props.data;
    var {ahead, behind, current, tracking} = status || {};
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

          <div className={true}>
            <label>{shortPathName}</label>
            <div className={styles.branchInfo}>
              <div className={styles.current}>Local Branch: <span>{current}</span></div>
              <div className={styles.tracking}>-> Tracks Remote: <span>{tracking}</span></div>
            </div>
          </div>

          <div className={styles.status}>
            <If condition={health === 'healthy'}>
              <div className={styles.upToDate}>
                <span>Up to Date!</span>
              </div>
            <Else/>
              <div className={styles.buttons}>
                <button className={styles.pull}>git pull</button>
              </div>

              <div className={styles.ahead}>+{ahead}</div>
                <div className={styles.divider}>/</div>
              <div className={styles.behind}>-{behind}</div>

            </If>

          </div>
      </div>
    );
  }

}

