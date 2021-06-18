import React, { Component } from 'react'  
import "@fullcalendar/common/main.css";  
import "@fullcalendar/daygrid/main.css";  
import FullCalendar from "@fullcalendar/react";  
import dayGridPlugin from "@fullcalendar/daygrid";  
import axios from 'axios';

export class Calendar extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      eventList: []
    }
  }

  // On component load, fetch the session dates from the database.
  componentDidMount() {
    axios.get(`https://62zrxtutca.execute-api.us-east-1.amazonaws.com/dev/sessions`)
    .then( (response) => {
      let eventSequence = [];
      response.data.forEach(element => {
        eventSequence.push({
          title: "Daniel Timeslot",  //TODO: create a sessions/view endpoint that will get the DM name for the title
          date: element.start_time
        });
      });
      this.setState({
        eventList: eventSequence
      });
    })
    .catch( (err) => {
      console.error('Error while fetching sessions: ', err);
    });
  }

  render() {  
    return (  
      <div className="container">  
        <div className="row title" style={{ marginTop: "20px" }} >  
          <div class="col-sm-12 btn btn-info">  
            Dungeon Master Sessions  
          </div>  
        </div>  
        <FullCalendar  
            defaultView="dayGridMonth"
            timeZone="America/Chicago"
            plugins={[dayGridPlugin]}  
            events={this.state.eventList}  
        />  
      </div>  
    );
  }  
};

export default Calendar;
