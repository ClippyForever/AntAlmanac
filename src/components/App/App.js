import React, {Component, Fragment} from 'react';
import {Grid, Toolbar, Typography, AppBar, Paper, Button, CssBaseline, IconButton} from '@material-ui/core';
import SearchForm from "../SearchForm/SearchForm";
import CoursePane from "../CoursePane/CoursePane";
import Calendar from "../Calendar/Calendar";
import {Dns, ListAlt} from "@material-ui/icons";
import {
    red,
    pink,
    purple,
    indigo,
    deepPurple,
    blue,
    green,
    cyan,
    teal,
    lightGreen,
    lime,
    amber,
    blueGrey
} from '@material-ui/core/colors';

const arrayOfColors = [red[500], pink[500],
    purple[500], indigo[500],
    deepPurple[500], blue[500],
    green[500], cyan[500],
    teal[500], lightGreen[500],
    lime[500], amber[500],
    blueGrey[500]];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: null,
            schedule0Events: [],
            schedule1Events: [],
            schedule2Events: [],
            schedule3Events: [],
            currentScheduleIndex: 0,
            arrayOfColors0: arrayOfColors.slice(0),
            arrayOfColors1: arrayOfColors.slice(0),
            arrayOfColors2: arrayOfColors.slice(0),
            arrayOfColors3: arrayOfColors.slice(0),
            view: 1
        };

        this.updateFormData = this.updateFormData.bind(this);
        this.handleAddClass = this.handleAddClass.bind(this);
        this.handleClassDelete = this.handleClassDelete.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.handleAddCustomEvent = this.handleAddCustomEvent.bind(this);
        this.setView = this.setView.bind(this);
    }

    handleClassDelete(classCode) {
        let colorFound = false;

        const classEventsInCalendar = this.state['schedule' + this.state.currentScheduleIndex + 'Events'].filter(
            event => {
                if (!colorFound && event.classCode === classCode && event.color !== undefined) {
                    this.setState({['arrayOfColors' + this.state.currentScheduleIndex]: this.state['arrayOfColors' + this.state.currentScheduleIndex].concat(event.color)});
                    colorFound = true;
                }
                return event.classCode !== classCode;
            }
        );
        this.setState({['schedule' + this.state.currentScheduleIndex + 'Events']: classEventsInCalendar});
    }

    handleAddClass(section, name, scheduleNumber) {
        if (scheduleNumber === 4) {
            this.handleAddClass(section, name, 0);
            this.handleAddClass(section, name, 1);
            this.handleAddClass(section, name, 2);
            this.handleAddClass(section, name, 3);
            return;
        }
        const arrayOfColorsName = 'arrayOfColors' + scheduleNumber;

        const randomColor = this.state[arrayOfColorsName][this.state[arrayOfColorsName].length - 1];

        const checkExist = this.state['schedule' + scheduleNumber + 'Events'].find((element) =>
            element.classCode === section.classCode
        );

        if (!checkExist) {
            this.setState({[arrayOfColorsName]: this.state[arrayOfColorsName].filter(color => color !== randomColor)});

            let newClasses = [];

            section.meetings.forEach(meeting => {
                const timeString = meeting[0].replace(/\s/g, "");

                if (timeString !== 'TBA') {

                    let [_, dates, start, startMin, end, endMin, ampm] = timeString.match(/([A-za-z]+)(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})(p?)/);

                    start = parseInt(start, 10);
                    startMin = parseInt(startMin, 10);
                    end = parseInt(end, 10);
                    endMin = parseInt(endMin, 10);
                    dates = [dates.includes('M'), dates.includes('Tu'), dates.includes('W'), dates.includes('Th'), dates.includes('F')];

                    if (ampm === 'p' && end !== 12) {
                        start += 12;
                        end += 12;
                        if (start > end) start -= 12;
                    }

                    dates.forEach((shouldBeInCal, index) => {
                        if (shouldBeInCal) {
                            const newClass = {
                                color: randomColor,
                                title: name[0] + ' ' + name[1],
                                location: meeting[1],
                                classCode: section.classCode,
                                type: section.classType,
                                start: new Date(2018, 0, index + 1, start, startMin),
                                end: new Date(2018, 0, index + 1, end, endMin)
                            };

                            newClasses.push(newClass);
                        }
                    });
                }
            });

            this.setState({['schedule' + scheduleNumber + 'Events']: this.state['schedule' + scheduleNumber + 'Events'].concat(newClasses)});
        }
    }

    handleScheduleChange(direction) {
        if (direction === 0) {
            if (this.state.currentScheduleIndex !== 0) {
                this.setState({currentScheduleIndex: this.state.currentScheduleIndex - 1});
            }
        } else if (direction === 1) {
            if (this.state.currentScheduleIndex !== 3) {
                this.setState({currentScheduleIndex: this.state.currentScheduleIndex + 1});
            }
        }
    }

    updateFormData(formData) {
        this.setState({formData: formData});
    }

    handleAddCustomEvent(events, calendarIndex) {
        if (calendarIndex === 4) {
            this.setState({['schedule' + 0 + 'Events']: this.state['schedule' + 0 + 'Events'].concat(events)});
            this.setState({['schedule' + 1 + 'Events']: this.state['schedule' + 1 + 'Events'].concat(events)});
            this.setState({['schedule' + 2 + 'Events']: this.state['schedule' + 2 + 'Events'].concat(events)});
            this.setState({['schedule' + 3 + 'Events']: this.state['schedule' + 3 + 'Events'].concat(events)});
        } else {
            this.setState({['schedule' + calendarIndex + 'Events']: this.state['schedule' + calendarIndex + 'Events'].concat(events)});
        }
    };

    setView(viewNum) {
        this.setState({view: viewNum});
    }

    render() {
        return (
            <Fragment>
                <CssBaseline/>
                <AppBar position='static'>
                    <Toolbar variant='dense'>
                        <Typography variant="title" color="inherit" style={{flexGrow: 1}}>AntAlmanac</Typography>
                        <Button color="inherit">Load Schedule</Button>
                        <Button color="inherit">Save Schedule</Button>
                    </Toolbar>
                </AppBar>

                <Grid container>
                    <Grid item lg={12}>
                        <SearchForm updateFormData={this.updateFormData}/>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <div style={{margin: '10px 5px 0px 10px'}}>
                            <Calendar
                                classEventsInCalendar={this.state['schedule' + this.state.currentScheduleIndex + 'Events']}
                                currentScheduleIndex={this.state.currentScheduleIndex}
                                onClassDelete={this.handleClassDelete}
                                onScheduleChange={this.handleScheduleChange}
                                onAddCustomEvent={this.handleAddCustomEvent}/>
                        </div>
                    </Grid>

                    <Grid item lg={6} xs={12}>
                        <Paper style={{overflow: 'hidden', margin: '10px 10px 0px 5px'}}>
                            <Toolbar variant='dense' style={{backgroundColor: '#5191d6'}}>
                                <IconButton onClick={() => this.setView(0)}><ListAlt/></IconButton>
                                <IconButton onClick={() => this.setView(1)}><Dns/></IconButton>
                            </Toolbar>
                        </Paper>

                        <Paper style={{height: '80vh', overflow: 'auto', margin: '10px 10px 0px 5px', padding: 10}}>
                            <CoursePane
                                view={this.state.view}
                                formData={this.state.formData}
                                onAddClass={this.handleAddClass}/>
                            <Paper/>
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }


}

export default App;
