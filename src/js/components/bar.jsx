import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import SingleIcon from 'material-ui/svg-icons/image/adjust';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/content/send';


export default class Bar extends React.Component {
  render () {
    let muiTheme = this._reactInternalInstance._context.muiTheme;

    let { selected, single, user, path, order,
      setSingleMode, setPathMode, setUserMode, setOrderMode, dispatch, // eslint-disable-line no-unused-vars
      ...other } = this.props;

    const setMode = (mode, value) => {
      return () => this.props[`${mode}Mode`](value);
    };

    let icons;
    if (selected >= 0) {
      icons = (
        <div>
          <IconButton onTouchTap={setMode('single', !single)} tooltip='Single Point Mode'>
            <SingleIcon color={single ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={setMode('path', !path)} tooltip='Path Mode'>
            <PathIcon color={path ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={setMode('user', !user)} tooltip='User Mode'>
            <UserIcon color={user ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={setMode('order', !order)} tooltip='Command Mode'>
            <CommandIcon color={order ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
        </div>
      );
    }

    return (
      <AppBar {...other} iconElementRight={icons}
        iconStyleRight={{ marginRight: 0 }}
      />
    );
  }
}
