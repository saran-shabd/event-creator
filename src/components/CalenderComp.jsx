import React, { Component } from 'react';
import { DatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import redux actions
import {
  loadAllEventsInAMonth,
  postEventInDB
} from '../store/actions/eventActions';

class CalenderComp extends Component {
  state = {
    // event details
    date: undefined,
    eventTimestamp: undefined,
    eventTitle: '',
    eventDescription: '',
    eventVenue: '',
    // service providers
    transport: false,
    caterer: false,
    // dialog flag value
    open: false,
    // create new event flag
    createNewEvent: false
  };

  componentWillMount() {
    this.props
      .loadAllEventsInAMonth()
      .then(() => {})
      .catch(() => {
        alert('Could not load data from database');
      });
  }

  handleOnOpen = () => this.setState({ open: true });
  handleOnClose = () => this.setState({ open: false });

  onDateChange = date => {
    // update event date

    this.setState({ date });
    const dateArr = date.toString().split(' ');
    const eventDate = dateArr[2];
    const eventMonth = dateArr[1];
    const eventYear = dateArr[3];

    const eventTimestamp = new Date(`${eventDate}/${eventMonth}/${eventYear}`);
    this.setState({ eventTimestamp });

    // open modal
    this.handleOnOpen();
  };

  onRegisterEvent = () => {
    this.setState({ createNewEvent: false });

    // API call
    this.props.postEventInDB();
  };

  render() {
    return (
      <div>
        <DatePicker
          autoOk
          orientation='landscape'
          variant='static'
          openTo='date'
          value={this.state.date}
          onChange={this.onDateChange}
        />
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleOnClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Events</DialogTitle>

          <DialogContent>
            {/* Already Existing Event(s) Details */}
            {/* TODO */}

            {!this.state.createNewEvent ? (
              <Button
                variant='outlined'
                fullWidth
                onClick={() => this.setState({ createNewEvent: true })}
              >
                Create New Event
              </Button>
            ) : null}

            <br />
            <br />

            {/* Dialog to Create New Event */}

            {this.state.createNewEvent ? (
              <span>
                <TextField
                  autoFocus
                  fullWidth
                  margin='dense'
                  label='Event Title'
                  value={this.state.eventTitle}
                  onChange={eventTitle =>
                    this.setState({ eventTitle: eventTitle.target.value })
                  }
                />
                <br />
                {/* <br /> */}
                <TextField
                  multiline
                  fullWidth
                  margin='dense'
                  label='Event Brief Description'
                  value={this.state.eventDescription}
                  onChange={eventDescription =>
                    this.setState({
                      eventDescription: eventDescription.target.value
                    })
                  }
                />
                <FormControl fullWidth>
                  <InputLabel>Venue</InputLabel>
                  <Select
                    value={this.state.eventVenue}
                    onChange={e =>
                      this.setState({ eventVenue: e.target.value })
                    }
                  >
                    <MenuItem value='TM Pai Auditorium 1'>
                      TM Pai Auditorium 1
                    </MenuItem>
                    <MenuItem value='TM Pai Auditorium 1'>
                      TM Pai Auditorium 2
                    </MenuItem>
                    <MenuItem value='TM Pai Auditorium 1'>
                      TM Pai Auditorium 3
                    </MenuItem>
                  </Select>
                </FormControl>

                <br />
                <br />

                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color='primary'
                        checked={this.state.transport}
                        onChange={() =>
                          this.setState({ transport: !this.state.transport })
                        }
                      />
                    }
                    label='Transport'
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        color='primary'
                        checked={this.state.caterer}
                        onChange={() =>
                          this.setState({ caterer: !this.state.caterer })
                        }
                      />
                    }
                    label='Caterer'
                  />
                </FormGroup>

                <br />
                <br />

                <Grid
                  container
                  direction='row'
                  justify='flex-end'
                  alignItems='center'
                >
                  <Button
                    variant='contained'
                    style={{
                      backgroundColor: 'green',
                      color: '#fff',
                      marginRight: '0.5rem'
                    }}
                    onClick={() => this.onRegisterEvent}
                  >
                    Register Event
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      this.setState({ createNewEvent: false });
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </span>
            ) : null}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleOnClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

CalenderComp.propTypes = {
  loadAllEventsInAMonth: PropTypes.func.isRequired
};

// const mapStateToProps = state => {};

export default connect(
  null,
  { loadAllEventsInAMonth, postEventInDB }
)(CalenderComp);
