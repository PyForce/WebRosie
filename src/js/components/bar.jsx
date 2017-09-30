import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import SingleIcon from 'material-ui/svg-icons/image/adjust';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/content/send';


export default class Bar extends React.Component {
  static contextTypes = {
    muiTheme: PropTypes.object
  }

  static propTypes = {
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    single: PropTypes.bool,
    user: PropTypes.bool,
    path: PropTypes.bool,
    order: PropTypes.bool,
    singleMode: PropTypes.func,
    pathMode: PropTypes.func,
    userMode: PropTypes.func,
    orderMode: PropTypes.func,
  }

  render () {
    const muiTheme = this.context.muiTheme;

    const { selected, single, user, path, order,
      singleMode, pathMode, userMode, orderMode,
      ...other } = this.props;

    let icons;
    if (selected) {
      icons = (
        <div>
          <IconButton onTouchTap={singleMode(!single)} tooltip='Single Point Mode'>
            <SingleIcon color={single ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={pathMode(!path)} tooltip='Path Mode'>
            <PathIcon color={path ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={userMode(!user)} tooltip='User Mode'>
            <UserIcon color={user ? muiTheme.baseTheme.palette.accent1Color :
              muiTheme.appBar.textColor}
            />
          </IconButton>
          <IconButton onTouchTap={orderMode(!order)} tooltip='Command Mode'>
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
