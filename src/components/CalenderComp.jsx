import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import redux actions
import {
  loadAllServiceProviders,
  loadAllEventsInAMonth,
  postEventInDB
} from '../store/actions/eventActions'
import { Card, CardContent } from '@material-ui/core'

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
    createNewEvent: false,
    // events
    events: undefined,
    tempEvents: [
      {
        title: 'Temp Event',
        date: '2019-08-01'
      }
    ]
  }

  componentWillMount() {
    this.props.loadAllServiceProviders()
  }

  componentWillReceiveProps(props) {
    this.setState({ events: props.events })
  }

  handleOnOpen = () => this.setState({ open: true })
  handleOnClose = () => this.setState({ open: false })

  onDateChange = date => {
    const dateArr = date.toString().split(' ')
    const eventDate = dateArr[2]
    const eventMonth = dateArr[1]
    const eventYear = dateArr[3]

    this.props
      .loadAllEventsInAMonth(`${eventDate}/${eventMonth}/${eventYear}`)
      .then(() => {
        // update event date
        this.setState({ date })
        this.setState({
          eventTimestamp: `${eventDate}/${eventMonth}/${eventYear}`
        })

        // open modal
        this.handleOnOpen()
      })
      .catch(() => {
        alert('Could not load data from database')
      })
  }

  onRegisterEvent = () => {
    // this.setState({ createNewEvent: false });

    // get service provider email
    let services = []

    if (this.state.transport)
      services.push({
        handler: 'transport',
        handlerEmail: this.props.serviceProviders['transport']
      })

    if (this.state.caterer)
      services.push({
        handler: 'caterer',
        handlerEmail: this.props.serviceProviders['caterer']
      })

    // API call
    this.props
      .postEventInDB(
        this.state.eventTimestamp,
        this.state.eventTitle,
        this.state.eventDescription,
        this.state.eventVenue,
        services
      )
      .then(() => this.setState({ createNewEvent: false }))
      .catch(() => alert('please try again later'))
  }

  render() {
    return (
      <div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            style={{ paddingTop: 20, paddingBottom: 20 }}
          >
            <FullCalendar
              defaultView='dayGridMonth'
              plugins={[dayGridPlugin, interactionPlugin]}
              dateClick={date => this.onDateChange(date.date)}
            />
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleOnClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Events</DialogTitle>

          <DialogContent>
            {/* Already Existing Event(s) Details */}
            {this.state.events ? (
              <span>
                {this.state.events.map(event => {
                  return (
                    <>
                      <Card>
                        <CardContent>
                          <strong>Event Title</strong> {event.title}
                          <br />
                          <strong>Event Description</strong> {event.description}
                          <br />
                          <strong>Event Venue</strong> {event.venue}
                          <br />
                        </CardContent>
                      </Card>
                      <br />
                    </>
                  )
                })}
              </span>
            ) : null}

            {!this.state.createNewEvent ? (
              <Button
                variant='outlined'
                fullWidth
                onClick={() => this.setState({ createNewEvent: true })}
              >
                Create New Event
              </Button>
            ) : null}

            {/* Dialog to Create New Event */}

            {this.state.createNewEvent ? (
              <span>
                <h3>Register New Event</h3>
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
                    onClick={this.onRegisterEvent}
                  >
                    Register Event
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      this.setState({ createNewEvent: false })
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
    )
  }
}

CalenderComp.propTypes = {
  loadAllEventsInAMonth: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  serviceProviders: state.service,
  events: state.event.events
})

export default connect(
  mapStateToProps,
  { loadAllServiceProviders, loadAllEventsInAMonth, postEventInDB }
)(CalenderComp)
