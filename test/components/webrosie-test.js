import { expect } from 'chai';

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import WebRosie from '../../src/js/components/webrosie.jsx';

describe('WebRosie component', function () {
  before(() => {
    this.result = ReactTestRenderer.create(
      <WebRosie />
    ).toJSON();
  });

  it('renders a <div>', () => {
    expect(this.result.type).to.equal('div');
  });
});
