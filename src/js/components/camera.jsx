import React from 'react';
import Paper from 'material-ui/Paper';


export default class WebCam extends React.Component {
  render () {
    let style = {
      position: 'absolute',
      width: '25%',
      height: '25%',
      right: '5%',
      top: '15%',
      zIndex: '10002'
    };

    return (
      <Paper style={style} zDepth={2}>
        <img src={this.props.url} alt=""/>
      </Paper>
    );
  }
}
