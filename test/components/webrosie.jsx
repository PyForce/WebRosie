import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import { shallow } from 'enzyme'
import { expect, use } from 'chai'

import AddRobotDialog from '../../src/js/components/robotdialog';

chai.use(chaiEnzyme())


describe('WebRosie components', () => {
  describe('Robot dialog', () => {
    const wrapper = shallow(<AddRobotDialog />);

    it('renders content', () => {
      expect(wrapper).to.not.be.blank();
    });
  });
});
