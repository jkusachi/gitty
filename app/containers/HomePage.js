import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

import Home from '../components/Home';

import { connect } from 'react-redux';
import * as SetupActions  from '../actions/setup';

function mapStateToProps(state){
  return {
    setup: state.setup
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(SetupActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
