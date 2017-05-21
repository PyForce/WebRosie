import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AcceptIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/content/clear';


export class PathActions extends React.Component {
  render () {
    return (
      <div className='actions' style={this.props.style}>
        <FloatingActionButton disabled={!this.props.path} onTouchTap={this.props.handleSendPath}
          style={{ display: 'block' }}>
          <AcceptIcon />
        </FloatingActionButton>
        <FloatingActionButton disabled={!this.props.path} onTouchTap={this.props.handleModeOff}
          style={{ display: 'block' }}>
          <CancelIcon />
        </FloatingActionButton>
      </div>
    );
  }
}
