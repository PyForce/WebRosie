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
