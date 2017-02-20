import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as actions from '../src/js/actions';
import * as reducers from '../src/js/reducers';


describe('WebRosie store', function () {
  before(() => {
    let reducer = combineReducers(reducers);
    this.store = createStore(reducer, applyMiddleware(thunkMiddleware));
    // add a robot to test requests
    this.store.dispatch(actions.addRobot('localhost', 5000));
    this.store.dispatch(actions.selectRobot(0));
  });

  it('creates the full initial state', () => {
    this.store.dispatch({ type: -1 });

    expect(
      this.store.getState()
    ).to.have.all.keys(
      'robots',
      'lastaction',
      'report',
      'robot',
      'map',
      'mode',
      'direction',
      'move'
    );
  });

  it('dispatches an user mode action', () => {
    let check = () => {
      expect(
          this.store.getState()
        )
        .to.have.property('mode')
        .that.has.property('user')
        .that.is.true;
    };
    return this.store.dispatch(actions.setUser(true))
      .then(check);
  });
});
