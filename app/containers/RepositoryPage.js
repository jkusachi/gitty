'use strict';

import React, {Component} from 'react';
import { bindActionCreators } from 'redux';

import RepositoryList from '../components/RepositoryList/RepositoryList';

import {connect} from 'react-redux';
import * as RepositoryActions from '../actions/setup';


function mapStateToProps(state){
  return {
    setup: state.setup
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(RepositoryActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryList);
