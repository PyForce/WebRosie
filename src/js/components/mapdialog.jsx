import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableRow, TableHeader, TableHeaderColumn, TableBody,
         TableRowColumn, TableFooter } from 'material-ui/Table';


export default class MapDialog extends React.Component {
  state = {
    maps: [],
    any: false,
    map: undefined
  }

  componentWillReceiveProps (nextProps) {
    let { open, robots } = nextProps;
    if (!open || !robots) {
      return;
    }

    this.setState({ maps: [] });
    robots.forEach((robotInfo) => {
      // for each robot, load its maps and add them to the state
      let { id, robot } = robotInfo;
      this.loadMaps(robot, id)
        .then((data) => {
          this.setState({ maps: this.state.maps.concat(data) });
        });
    });
  }

  loadMaps = (robot, id) => {
    // load maps of a single robot
    return robot.maps()
      .then((data) => data.map((name) => ({
        name: name,
        robot: robot.name,
        robotaddr: `${robot.host}:${robot.port}`,
        id: id  // id of the robot owner
      }))
      );
  }

  acceptDialog = () => {
    this.props.onRequestClose(true, this.state.map);
  }

  cancelDialog = () => {
    this.props.onRequestClose(false);
  }

  handleSelection = (selection) => {
    let any = selection.length > 0;
    if (any) {
      // get the map info
      let { name, id } = this.state.maps[selection[0]];
      // get the map owner
      let { robot } = this.props.robots[id];
      robot.map(name)
        .then((map) => {
          this.setState({ map: map });
        });
    }
    this.setState({ any: any });
  }

  render () {
    let { robots, ...other } = this.props;
    const actions = [
      <FlatButton label="Cancel" onTouchTap={this.cancelDialog}
                  primary={true} keyboardFocused={true} />,
      <FlatButton label="Accept" onTouchTap={this.acceptDialog}
                  primary={true}
                  disabled={!this.state.any} />,
    ];

    let rows = this.state.maps.map((elem, index) => (
      <TableRow key={index}>
        <TableRowColumn>{elem.name}</TableRowColumn>
        <TableRowColumn>{elem.robot}</TableRowColumn>
        <TableRowColumn>{elem.robotaddr}</TableRowColumn>
      </TableRow>
    ));

    return (
      <Dialog title="Map Select" modal={true} fixedHeader={true} actions={actions}
              {...other}>
        Select the map to load in the application<br />
        <Table selectable={true} multiSelectable={false}
               onRowSelection={this.handleSelection}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn tooltip="Map name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Robot that has the map">Robot</TableHeaderColumn>
              <TableHeaderColumn tooltip="Address of the robot">Address</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} deselectOnClickaway={false}>
            {rows}
          </TableBody>
          {rows.length > 0 ? undefined :
            <TableFooter adjustForCheckbox={false}>
              <TableRow style={{ borderTop: null }}>
                <TableRowColumn colSpan="3" style={{ textAlign: 'center' }}>
                  No maps available
                </TableRowColumn>
              </TableRow>
            </TableFooter>}
        </Table>
      </Dialog>
    );
  }
}
