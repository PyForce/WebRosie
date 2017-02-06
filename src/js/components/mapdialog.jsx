import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableRow, TableHeader, TableHeaderColumn, TableBody,
         TableRowColumn, TableFooter } from 'material-ui/Table';


export default class MapDialog extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      maps: [],
      any: false
    };

    this.acceptDialog = this.acceptDialog.bind(this);
    this.cancelDialog = this.cancelDialog.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    let { open, robots } = nextProps;
    if (!open || !robots) {
      return;
    }

    this.setState({maps: []});
    robots.forEach((robotInfo) => {
      // for each robot, load its maps and add them to the state
      let { robot } = robotInfo;
      this.loadMaps(robot)
        .then((data) => {
          this.setState({maps: this.state.maps.concat(data)});
        });
    });
  }

  loadMaps (robot) {
    // load maps of a single robot
    return robot.maps()
      .then((data) => data.map((name) => ({
        name: name,
        robot: robot.name,
        robotaddr: `${robot.host}:${robot.port}`
      }))
      );
  }

  acceptDialog () {
    this.props.onRequestClose(true);
  }

  cancelDialog () {
    this.props.onRequestClose(false);
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
               onRowSelection={(s) => this.setState({any: s.length > 0})}>
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
              <TableRow style={{borderTop: null}}>
                <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                  No maps available
                </TableRowColumn>
              </TableRow>
            </TableFooter>}
        </Table>
      </Dialog>
    );
  }
}
