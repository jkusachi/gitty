'use strict';

import React, {Component} from 'react';
import { bindActionCreators } from 'redux';

import RepositoryList from '../components/RepositoryList/RepositoryList';

import {connect} from 'react-redux';
import * as RepositoryActions from '../actions/repositories';


function mapStateToProps(state){
  return {
    repositories: state.repositories
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(RepositoryActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryList);
