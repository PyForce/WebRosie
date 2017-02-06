import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/action/input';


export default class Bar extends React.Component {
  render () {
    let muiTheme = this._reactInternalInstance._context.muiTheme;

    let { selected, dispatch, user, path, order,
          setPathMode, setUserMode, setOrderMode, ...other } = this.props;

    let icons;
    if (selected >= 0) {
      icons =
        <div>
          <IconButton tooltip="Path Mode"
                      onTouchTap={() => setPathMode(!path)}>
            <PathIcon color={path ? muiTheme.baseTheme.palette.accent1Color :
                                    muiTheme.appBar.textColor} />
          </IconButton>
          <IconButton tooltip="User Mode"
                      onTouchTap={() => setUserMode(!user)}>
            <UserIcon color={user ? muiTheme.baseTheme.palette.accent1Color :
                                    muiTheme.appBar.textColor} />
          </IconButton>
          <IconButton tooltip="Command Mode"
                      onTouchTap={() => setOrderMode(!order)}>
            <CommandIcon color={order ? muiTheme.baseTheme.palette.accent1Color :
                                        muiTheme.appBar.textColor} />
          </IconButton>
        </div>;
    }

    return (
      <AppBar {...other} iconElementRight={icons}
                        iconStyleRight={{marginRight: 0}}/>
    );
  }
}
