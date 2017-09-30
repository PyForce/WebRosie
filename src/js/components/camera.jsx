import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import ResizeAndDrag from 'react-rnd';


export default class WebCam extends React.Component {
  static propTypes = {
    url: PropTypes.string
  }

  render () {
    const style = {
      width: '100%',
      height: '100%'
    };
    const [ width, height ] = [ 200, 200 ];
    // locate the camera viewer in right: 15%, top: 10%
    const [ x, y ] = [ 14 * window.innerWidth / 15 - width, -window.innerHeight / 5 ];

    return (
      <ResizeAndDrag initial={{ x: x, y: y, width: width, height: height }} zIndex={1002}>
        <Paper style={{ height: '100%', width: '100%' }} zDepth={2}>
          <img src={this.props.url} style={style} />
        </Paper>
      </ResizeAndDrag>
    );
  }
}
