import { expect } from 'chai'

import * as reducers from '../src/js/reducers'
import * as actions from '../src/js/actions'


describe('mode reducer', function () {
  it('returns the initial state', () => {
    expect(
      reducers.mode(undefined, {})
    )
    .to.be.deep.equal({
      order: false,
      path: false,
      user: false
    });
  });

  it('activates the user mode', () => {
    expect(
      reducers.mode(undefined, actions.setUser(true))
    )
    .to.have.property('user')
    .and.to.be.true;
  });

  it('activates only the path mode', () => {
    expect(
      reducers.mode({
        order: true,
        user: false,
        path: false
      }, actions.setPath(true))
    )
    .to.be.deep.equal({
      order: false,
      user: false,
      path: true
    });
  });
});

describe('keys reducer', () => {
  it('adds pressed keys', () => {
    expect(
      reducers.keys([12], actions.pressKey(32))
    )
    .to.include(12)
    .and.include(32);
  });

  it('does not repeat keys', () => {
    expect(
      reducers.keys([32, 12], actions.pressKey(32))
    ).to.be.deep.equal([32, 12]);
  });

  it('removes released keys', () => {
    expect(
      reducers.keys([12, 32], actions.releaseKey(32))
    )
    .to.include(12)
    .and.not.include(32);
  });
});
