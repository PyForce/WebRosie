import { expect } from 'chai';

import * as reducers from '../src/js/reducers';
import * as actions from '../src/js/actions';


describe('mode reducer', function () {
  it('returns the initial state', () => {
    expect(
      reducers.mode(undefined, {})
    )
    .to.be.deep.equal({
      order: false,
      single: false,
      path: false,
      user: false
    });
  });

  it('activates the user mode', () => {
    expect(
      reducers.mode(undefined, {type: actions.USER_MODE, value: true})
    )
    .to.have.property('user')
    .and.to.be.true;
  });

  it('activates only the path mode', () => {
    expect(
      reducers.mode({
        order: true,
        user: false,
        single: false,
        path: false
      }, {type: actions.PATH_MODE, value: true})
    )
    .to.be.deep.equal({
      order: false,
      user: false,
      single: false,
      path: true
    });
  });
});

describe('move reducer', () => {
  it('does not repeat moves', () => {
    expect(
      reducers.move({id: 3, x: 2.3, y: 4, angle: 32}, actions.pressKeyAction(32))
    )
    .to.not.exist;
  });
});

const keys = {
  W: 87,
  S: 83,
  D: 68,
  A: 65,
  E: 69,
  Q: 81
};

describe('direction reducer', () => {
  it('goes up', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.W))
    )
    .to.be.deep.equal([0, 1, 0]);
  });

  it('goes down', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.S))
    )
    .to.be.deep.equal([0, -1, 0]);
  });

  it('goes left', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.A))
    )
    .to.be.deep.equal([-1, 0, 0]);
  });

  it('goes right', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.D))
    )
    .to.be.deep.equal([1, 0, 0]);
  });

  it('goes north-east', () => {
    expect(
      reducers.direction([0, 1, 0], actions.pressKeyAction(keys.D))
    )
    .to.be.deep.equal([1, 1, 0]);
  });

  it('stops going north-east', () => {
    expect(
      reducers.direction([1, 1, 0], actions.releaseKeyAction(keys.W))
    )
    .to.be.deep.equal([1, 0, 0]);
  });

  it('stops on opposite keys', () => {
    expect(
      reducers.direction([0, 1, 0], actions.pressKeyAction(keys.S))
    )
    .to.be.deep.equal([0, 0, 0]);
  });

  it('rotates rigth in-place', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.E))
    )
    .to.be.deep.equal([0, 0, 1]);
  });

  it('rotates left in-place', () => {
    expect(
      reducers.direction([0, 0, 0], actions.pressKeyAction(keys.Q))
    )
    .to.be.deep.equal([0, 0, -1]);
  });
});

describe('settings reducer', () => {
  it('adds new options', () => {
    expect(
      reducers.settings({}, actions.configOption({size: 3}))
    ).to.have.property('size')
    .that.is.equal(3);
  });

  it('changes values', () => {
    expect(
      reducers.settings({size: 5}, actions.configOption({size: 42}))
    ).to.have.property('size')
    .that.is.equal(42);
  });

  it('does not conflict with another actions', () => {
    expect(
      reducers.settings({ask: true, mode: 'one'}, actions.configOption({size: 3}))
    )
    .to.have.all.keys(['mode', 'ask', 'size'])
    .and.to.have.property('size')
    .that.is.equal(3);
  });

  it('changes only the desired values', () => {
    expect(
      reducers.settings({ask: true, mode: 'one'}, actions.configOption({ask: false, size: 3}))
    )
    .to.have.all.keys(['mode', 'ask', 'size'])
    .and.to.contain.all.keys({
      ask: false,
      size: 3
    });
  });
});
