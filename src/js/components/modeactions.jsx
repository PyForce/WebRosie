import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AcceptIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/content/clear';


export class PathActions extends React.Component {
  render () {
    return (
      <div style={this.props.style} className='actions'>
        <FloatingActionButton style={{ display: 'block' }} disabled={!this.props.path}
                              onTouchTap={this.props.sendPath}>
          <AcceptIcon />
        </FloatingActionButton>
        <FloatingActionButton style={{ display: 'block' }}
                              onTouchTap={this.props.modeOff}
                              disabled={!this.props.path}>
          <CancelIcon />
        </FloatingActionButton>
      </div>
    );
  }
}
