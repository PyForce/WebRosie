import React from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import ContentAddIcon from 'material-ui/svg-icons/content/add'
import CircularProgress from 'material-ui/CircularProgress'

import RosieMap from '../containers/rosiemap'
import AddRobotDialog from './robotdialog'


export default class MainApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = { drawer: false, loading: true, dialog: false };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    let store = this._reactInternalInstance._context.store;

    store.subscribe(() => {
      let { move, robots } = store.getState();
      if (!move)
        return;

      let overlay = robots[move.id].robot.overlay;
      overlay.latlng = [move.x, move.y];
      overlay.angle = move.angle;
    });
  }

  componentWillMount() {
    window.addEventListener('load', () => this.setState({ loading: false }));
  }

  toggleDrawer() {
    this.setState({ drawer: !this.state.drawer });
  }

  openDialog() {
    this.setState({ dialog: true, drawer: false });
  }

  closeDialog(accepted, ...data) {
    if (accepted)
      this.props.onAddRobot(...data);

    // hide the dialog
    this.setState({ dialog: false });
  }

  render () {
    let pageContent;
    if (this.state.loading)
      pageContent = <CircularProgress />;
    else
      pageContent = <RosieMap />;

    return (
      <div>
        <AddRobotDialog open={this.state.dialog} onRequestClose={this.closeDialog}/>

        <Drawer open={this.state.drawer} docked={false}
                onRequestChange={(open) => this.setState({ drawer: open })}>
          <MenuItem primaryText="Add robot" leftIcon={<ContentAddIcon />}
            onTouchTap={this.openDialog}/>
        </Drawer>

        <div style={{height: '100%'}} className='flex column wrap start'>
          <AppBar onLeftIconButtonTouchTap={this.toggleDrawer} />
          {pageContent}
        </div>
      </div>
    );
  }
};
