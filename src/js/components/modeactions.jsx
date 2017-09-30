import React from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AcceptIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/content/clear';


export class PathActions extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    path: PropTypes.bool,
    handleSendPath: PropTypes.func,
    handleModeOff: PropTypes.func
  }

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
