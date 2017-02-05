import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PathIcon from 'material-ui/svg-icons/communication/swap-calls';
import UserIcon from 'material-ui/svg-icons/action/open-with';
import CommandIcon from 'material-ui/svg-icons/action/input';


export default class Bar extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render () {
    let muiTheme = this._reactInternalInstance._context.muiTheme;

    let { selected, dispatch, ...rest } = this.props;
    let icons = <div>
        <IconButton tooltip="Path Mode">
          <PathIcon color={muiTheme.appBar.textColor} />
        </IconButton>
        <IconButton tooltip="User Mode">
          <UserIcon color={muiTheme.appBar.textColor} />
        </IconButton>
        <IconButton tooltip="Command Mode">
          <CommandIcon color={muiTheme.appBar.textColor} />
        </IconButton>
      </div>;

    return (
      <AppBar {...rest} iconElementRight={icons}
                        iconStyleRight={{marginRight: 0}}/>
    );
  }
}
