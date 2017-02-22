import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as actions from '../src/js/actions';
import * as reducers from '../src/js/reducers';


describe('WebRosie store', function () {
  before(() => {
    let reducer = combineReducers(reducers);
    this.store = createStore(reducer, applyMiddleware(thunkMiddleware));
  });

  it('creates the full initial state', () => {
    this.store.dispatch({ type: -1 });

    expect(
      this.store.getState()
    ).to.have.all.keys(
      'robots',
      'report',
      'robot',
      'path',
      'map',
      'mode',
      'direction',
      'move',
      'settings'
    );
  });

  it('dispatches an user mode action', () => {
    this.store.dispatch(actions.setUserAction(true));

    expect(
      this.store.getState()
    )
    .to.have.property('mode')
    .that.has.property('user')
    .that.is.true;
  });
});
