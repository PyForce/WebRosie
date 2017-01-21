import { expect } from 'chai'
import { createStore, combineReducers } from 'redux'

import * as actions from '../src/js/actions'
import * as reducers from '../src/js/reducers'


describe('WebRosie store', function () {
  before(() => {
    let reducer = combineReducers(reducers);
    this.store = createStore(reducer);
  });

  it('creates the full initial state', () => {
    this.store.dispatch({ type: -1 });

    expect(
      this.store.getState()
    ).to.have.all.keys(
      'robots',
      'robot',
      'map',
      'mode',
      'keys'
    );
  });

  it('dispatches an user mode action', () => {
    this.store.dispatch(actions.setUser(true));

    expect(
      this.store.getState()
    )
    .to.have.property('mode')
    .that.has.property('user')
    .that.is.true;
  });
});
