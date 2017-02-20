import React from 'react';
import Nipple from 'nipplejs';


export default class TouchJoystick extends React.Component {
  componentDidMount () {
    let muiTheme = this._reactInternalInstance._context.muiTheme;

    this.manager = Nipple.create({
      zone: this.zone,
      mode: 'static',
      color: muiTheme.palette.primary1Color,
      position: {
        top: '45%',
        left: '40%'
      }
    }).on('move', (event, data) => {
      let force = Math.min(data.force, 1);
      let movement = {
        x: force * Math.cos(data.angle.radian),
        y: force * Math.sin(data.angle.radian)
      };
      this.props.moveJoystick(movement);
    }).on('end', () => {
      this.props.moveJoystick({x: 0, y: 0});
    });
  }

  render () {
    return (
      <div ref={(r) => this.zone = r} style={this.props.style}/>
    );
  }
}
