import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableRow, TableHeader, TableHeaderColumn, TableBody,
         TableRowColumn, TableFooter } from 'material-ui/Table';


export default class MapDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    robots: PropTypes.array,
    onRequestClose: PropTypes.func
  }

  state = {
    maps: [],
    any: false,
    map: undefined
  }

  componentWillReceiveProps (nextProps) {
    const { open, robots } = nextProps;
    if (!open || !robots) {
      return;
    }

    this.setState({ maps: [] });
    robots.forEach((robotInfo) => {
      // for each robot, load its maps and add them to the state
      const { id, robot } = robotInfo;
      this.loadMaps(robot, id)
        .then((data) => {
          this.setState({ maps: this.state.maps.concat(data) });
        });
    });
  }

  loadMaps = (robot, id) => {
    // load maps of a single robot
    return robot.maps()
      .then((data) => data.maps.map((name) => ({
        name: name,
        robot: robot.name,
        robotaddr: `${robot.host}:${robot.port}`,
        id: id  // id of the robot owner
      }))
      );
  }

  handleAccept = () => {
    this.props.onRequestClose(true, this.state.map);
  }

  handleCancel = () => {
    this.props.onRequestClose(false);
  }

  handleSelection = (selection) => {
    const any = selection.length > 0;
    if (any) {
      // get the map info
      const { name, id } = this.state.maps[selection[0]];
      // get the map owner
      const { robot } = this.props.robots.find((r) => r.id === id);
      robot.map(name)
        .then((map) => {
          this.setState({ map: map });
        });
    }
    this.setState({ any: any });
  }

  render () {
    const { robots, ...other } = this.props;  // eslint-disable-line no-unused-vars
    const actions = [
      <FlatButton key={0} keyboardFocused label='Cancel' onTouchTap={this.handleCancel}
        primary
      />,
      <FlatButton disabled={!this.state.any} key={1} label='Accept' onTouchTap={this.handleAccept}
        primary
      />,
    ];

    const rows = this.state.maps.map((elem, index) => (
      <TableRow key={index}>
        <TableRowColumn>{elem.name}</TableRowColumn>
        <TableRowColumn>{elem.robot}</TableRowColumn>
        <TableRowColumn>{elem.robotaddr}</TableRowColumn>
      </TableRow>
    ));

    return (
      <Dialog actions={actions} fixedHeader modal title='Map Select'
        {...other}>
        {'Select the map to load in the application'} <br />
        <Table multiSelectable={false} onRowSelection={this.handleSelection} selectable>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn tooltip='Map name'>{'Name'}</TableHeaderColumn>
              <TableHeaderColumn tooltip='Robot that has the map'>{'Robot'}</TableHeaderColumn>
              <TableHeaderColumn tooltip='Address of the robot'>{'Address'}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody deselectOnClickaway={false} showRowHover>
            {rows}
          </TableBody>
          {rows.length > 0 ? undefined :
            <TableFooter adjustForCheckbox={false}>
              <TableRow style={{ borderTop: null }}>
                <TableRowColumn colSpan={3} style={{ textAlign: 'center' }}>
                  {'No maps available'}
                </TableRowColumn>
              </TableRow>
            </TableFooter>}
        </Table>
      </Dialog>
    );
  }
}
