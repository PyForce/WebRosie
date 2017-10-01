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
    selectedMap: null,
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
    const selected = this.state.maps[this.state.selectedMap - 1];
    // get the map owner
    const { robot } = this.props.robots.find((r) => r.id === selected.id);
    // get the map info
    robot.map(selected.name).then((map) => this.props.onRequestClose(true, map));
  }

  handleCancel = () => {
    this.props.onRequestClose(false);
  }

  handleSelection = (selection) => {
    this.setState({ selectedMap: selection.length > 0 && selection[0] + 1 });
  }

  render () {
    const { robots, ...other } = this.props;  // eslint-disable-line no-unused-vars
    let {selectedMap} = this.state;
    const actions = [
      <FlatButton key={0} label='Cancel' onTouchTap={this.handleCancel}
        primary
      />,
      <FlatButton disabled={!selectedMap} key={1} label='Accept' onTouchTap={this.handleAccept}
        primary
      />,
    ];

    selectedMap--;
    const rows = this.state.maps.map((elem, index) => (
      <TableRow key={index} selected={index === selectedMap}>
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
