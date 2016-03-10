'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Repositories.css';
import path from 'path';

import _ from 'lodash';

class Home extends Component {

  render() {
    if(this.props.items && this.props.items.length > 0){
      return this.renderRepos();
    }else {
      return (<div></div>)
    }
  }

  renderRepos(){
    return (
      <div className={styles.container}>
        <label>Currently Watched Repositories</label>
        <ul>
          {_.map(this.props.items, (item)=> {
            return (<li className="item">{item}</li>);
          })}
        </ul>

        <button onClick={()=> this.props.onClear() } className={styles.clearButton}>Clear Repositories</button>
      </div>
    );
  }

  renderEmpty(){
    return (
      <div></div>
    )
  }

}


export default Home;
