import React from 'react';
import Nipple from 'nipplejs'


export default class TouchJoystick extends React.Component {
  componentDidMount () {
    let muiTheme = this._reactInternalInstance._context.muiTheme;

    this.manager = Nipple.create({
      zone: this.zone,
      mode: 'static',
      color: muiTheme.palette.primary1Color,
      position: {
        top: '50%',
        left: '50%'
      }
    }).on('dir', (event, data) => {
      // take the direction in data.direction
      return;
    });
  }

  render () {
    const style = {
      position: 'absolute',
      height: '25%',
      width: '25%',
      bottom: 0,
      right: 0
    };

    return (
      <div ref={(r) => this.zone = r} style={style}/>
    )
  }
}
