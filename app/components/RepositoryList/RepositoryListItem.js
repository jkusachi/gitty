'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './RepositoryList.css';
import path from 'path';
import _ from 'lodash';


export default class RepositoryListItem extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={styles.listItem}>

          <div className={styles.buttons}>
            <button className={styles.fetch}>fetch</button>
            <button className={styles.pull}>pull</button>
          </div>
          <label>
            {this.props.data.path }
          </label>
      </div>
    );
  }

}

