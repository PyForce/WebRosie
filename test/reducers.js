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

describe('move reducer', () => {
  it('does not repeat moves', () => {
    expect(
      reducers.move({id: 3, x: 2.3, y: 4, angle: 32}, actions.pressKey(32))
    )
    .to.not.exist;
  });
});

const keys = {
  W: 87,
  S: 83,
  D: 68,
  A: 65
};

describe('direction reducer', () => {
  it('goes up', () => {
    expect(
      reducers.direction([0, 0], actions.pressKey(keys.W))
    )
    .to.be.deep.equal([0, 1]);
  });

  it('goes down', () => {
    expect(
      reducers.direction([0, 0], actions.pressKey(keys.S))
    )
    .to.be.deep.equal([0, -1]);
  });

  it('goes left', () => {
    expect(
      reducers.direction([0, 0], actions.pressKey(keys.A))
    )
    .to.be.deep.equal([-1, 0]);
  });

  it('goes right', () => {
    expect(
      reducers.direction([0, 0], actions.pressKey(keys.D))
    )
    .to.be.deep.equal([1, 0]);
  });

  it('goes north-east', () => {
    expect(
      reducers.direction([0, 1], actions.pressKey(keys.D))
    )
    .to.be.deep.equal([1, 1]);
  });

  it('stops going north-east', () => {
    expect(
      reducers.direction([1, 1], actions.releaseKey(keys.W))
    )
    .to.be.deep.equal([1, 0]);
  });

  it('stops on opposite keys', () => {
    expect(
      reducers.direction([0, 1], actions.pressKey(keys.S))
    )
    .to.be.deep.equal([0, 0]);
  });
});
