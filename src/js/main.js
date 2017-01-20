import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import WebRosie from './components/webrosie'
import store from './store'


function init () {
  let app = $('[data-section="app"]').get(0);

  render(
    <Provider store={store}>
      <WebRosie />
    </Provider>,
    app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
