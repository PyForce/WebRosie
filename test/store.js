import { expect } from 'chai'

import * as actions from '../src/js/actions'
import store from '../src/js/store'


describe('WebRosie store', function () {
  it('creates the full initial state', () => {
    store.dispatch({ type: -1 });

    expect(
      store.getState()
    ).to.have.all.keys(
      'robots',
      'robot',
      'map',
      'mode',
      'keys'
    );
  });

  it('dispatches an user mode action', () => {
    store.dispatch(actions.setUser(true));

    expect(
      store.getState()
    )
    .to.have.property('mode')
    .that.has.property('user')
    .that.is.true;
  });
});
