import React, {Component, Fragment} from 'react'
import BigCalendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "../../../node_modules/@material-ui/core/IconButton/IconButton";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    constructor(props) {
        super(props);
    }

    static eventStyleGetter(event, start, end, isSelected) {
        return {
            style: {
                backgroundColor: event.color
            }
        };
    }

    render() {
        return (
            <div>
                <Paper style={{overflow: 'hidden', marginBottom: 5}}>
                    <Toolbar variant='dense' style={{backgroundColor: '#5191d6'}}>
                        <IconButton onClick={() => this.props.onScheduleChange(0)}><ChevronLeft/></IconButton>
                        <IconButton onClick={() => this.props.onScheduleChange(1)}><ChevronRight/></IconButton>
                        <Typography variant='subheading'>{'Schedule ' + (this.props.currentScheduleIndex + 1)}</Typography>
                    </Toolbar>
                </Paper>

                <Paper style={{overflow: 'auto', maxHeight: '80vh'}}>
                    <BigCalendar
                        selectable
                        toolbar={false}
                        formats={{
                            timeGutterFormat: (date, culture, localizer) => date.getMinutes() > 0 ? '' : localizer.format(date, 'h A', culture),
                            dayFormat: 'ddd'
                        }}
                        defaultView={BigCalendar.Views.WORK_WEEK}
                        views={['work_week']}
                        step={15}
                        timeslots={2}
                        defaultDate={new Date(2018, 0, 1)}
                        min={new Date(2018, 0, 1, 7)}
                        max={new Date(2018, 0, 1, 23)}
                        events={this.props.classEventsInCalendar}
                        eventPropGetter={Calendar.eventStyleGetter}
                        onSelectEvent={event => this.props.onClassDelete(event.title)}
                    />
                </Paper>
            </div>
        )
    }
}

export default Calendar