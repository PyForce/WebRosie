import React from 'react';
import PropTypes from 'prop-types';
import Nipple from 'nipplejs';


export default class TouchJoystick extends React.Component {
  static contextTypes = {
    muiTheme: PropTypes.object
  }

  static propTypes = {
    moveJoystick: PropTypes.func,
    style: PropTypes.object
  }

  componentDidMount () {
    const muiTheme = this.context.muiTheme;

    this.manager = Nipple.create({
      zone: this.zone,
      mode: 'static',
      color: muiTheme.palette.primary1Color,
      position: {
        top: '50%',
        left: '50%'
      }
    }).on('move', (event, data) => {
      const force = Math.min(data.force, 1);
      const movement = {
        x: force * Math.cos(data.angle.radian),
        y: force * Math.sin(data.angle.radian)
      };
      this.props.moveJoystick(movement);
    }).on('end', () => {
      this.props.moveJoystick({ x: 0, y: 0 });
    });
  }

  render () {
    return (
      <div ref={(r) => this.zone = r} style={this.props.style}/>
    );
  }
}
