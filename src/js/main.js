import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { blue500 } from 'material-ui/styles/colors'

import * as reducers from './reducers'
import RosieApp from './containers/rosieapp'


const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500
    }
});

function init () {
  let app = document.getElementById('app');
  const reducer = combineReducers(reducers);
  const store = createStore(reducer);

  render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <RosieApp />
      </MuiThemeProvider>
    </Provider>,
    app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
