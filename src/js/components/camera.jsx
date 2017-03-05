import React from 'react';
import Paper from 'material-ui/Paper';
import ResizeAndDrag from 'react-rnd';


export default class WebCam extends React.Component {
  render () {
    let style = {
      width: '100%',
      height: '100%'
    };
    let [ width, height ] = [ 200, 200 ];
    // locate the camera viewer in right: 15%, top: 10%
    let [ x, y ] = [ 14 * window.innerWidth / 15 - width, -window.innerHeight / 5 ];

    return (
      <ResizeAndDrag zIndex={1002} initial={{ x: x, y: y, width: width, height: height }}>
        <Paper style={{ height: '100%', width: '100%' }} zDepth={2}>
          <img src={this.props.url} alt="" style={style} />
        </Paper>
      </ResizeAndDrag>
    );
  }
}
