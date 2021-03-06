import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle'
import {Menu, MenuItem} from "@material-ui/core";

const styles = theme => ({
    addButtonColumn: {
        padding: '0 8px 0 0',
        verticalAlign: 'middle',
        border: 'none'
    },
    noBorder: {
        border: 'none'
    }
});

class ScheduleAddSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {anchor: null};
    }

    handleClick = (event) => {
        this.setState({anchor: event.currentTarget});
    };

    handleClose = (scheduleNumber) => {
        this.setState({anchor: null});
        if (scheduleNumber !== -1) this.props.onAddClass(this.props.section, this.props.courseDetails.name, scheduleNumber);
    };

    render() {
        return (
            <Fragment>
                <AddCircle
                    color='primary'
                    onClick={this.handleClick}
                    style={{cursor: 'pointer'}}/>
                <Menu
                    anchorEl={this.state.anchor}
                    open={Boolean(this.state.anchor)}
                    onClose={() => this.handleClose(-1)}
                >
                    <MenuItem onClick={() => this.handleClose(0)}>Add to schedule 1</MenuItem>
                    <MenuItem onClick={() => this.handleClose(1)}>Add to schedule 2</MenuItem>
                    <MenuItem onClick={() => this.handleClose(2)}>Add to schedule 3</MenuItem>
                    <MenuItem onClick={() => this.handleClose(3)}>Add to schedule 4</MenuItem>
                    <MenuItem onClick={() => this.handleClose(4)}>Add to all</MenuItem>
                </Menu>
            </Fragment>
        );
    }
}

class SectionTable extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.courseDetails !== nextProps.courseDetails;
    }

    render() {
        const sectionInfo = this.props.courseDetails.sections;

        return (
            <table>
                <thead>
                <tr>
                    <th className={this.props.classes.addButtonColumn} >{}</th>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Instructors</th>
                    <th>Times</th>
                    <th>Places</th>
                    <th>Enrollment</th>
                    <th>Restrictions</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {sectionInfo.map((section) => {
                    return (
                        <tr>
                            <td className={this.props.classes.addButtonColumn}>
                                <ScheduleAddSelector onAddClass={this.props.onAddClass}
                                                     section={section}
                                                     courseDetails={this.props.courseDetails}/>
                            </td>
                            <td>{section.classCode}</td>
                            <td className='multiline'>
                                {
                                    `${section.classType}
Section: ${section.sectionCode}
Units: ${section.units}`
                                }</td>
                            <td className='multiline'>{section.instructors.join('\n')}</td>
                            <td className='multiline'>{section.meetings.map(meeting => meeting[0]).join('\n')}</td>
                            <td className='multiline'>{section.meetings.map(meeting => meeting[1]).join('\n')}</td>
                            <td className='multiline'>
                                <strong>{`${section.numCurrentlyEnrolled[0]} / ${section.maxCapacity}`}</strong>
                                {`
WL: ${section.numOnWaitlist}
NOR: ${section.numNewOnlyReserved}`
                                }
                            </td>
                            <td>{section.restrictions}</td>
                            <td className={section.status}>{section.status}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
}

//TODO: Convert CSS Sheet to JSS
export default withStyles(styles)(SectionTable);