import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { blue500 } from 'material-ui/styles/colors'

import WebRosie from './components/webrosie'
import store from './store'


const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500
    }
});


function init () {
  let app = $('#app').get(0);

  render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <WebRosie />
      </MuiThemeProvider>
    </Provider>,
    app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
