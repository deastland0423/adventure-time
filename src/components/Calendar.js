import React, { Component } from 'react'  
import "@fullcalendar/common/main.css";  
// import 'bootstrap/dist/css/bootstrap.min.css';
import "@fullcalendar/daygrid/main.css";  
import FullCalendar from "@fullcalendar/react";  
import dayGridPlugin from "@fullcalendar/daygrid";  
const events = [
  {
    title: "Daniel Timeslot",
    date: new Date('2021-04-01 18:00')
  },
  {
    title: "Daniel Timeslot",
    date: new Date('2021-04-10 12:00')
  },
  {
    title: "Daniel Timeslot",
    date: new Date('2021-04-15 18:00')
  },
  {
    title: "Daniel Timeslot",
    date: new Date('2021-04-29 18:00')
  },
];  

export class Calendar extends Component {  
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
            plugins={[dayGridPlugin]}  
            events={events}  
        />  
      </div>  
    );
  }  
};

export default Calendar;
