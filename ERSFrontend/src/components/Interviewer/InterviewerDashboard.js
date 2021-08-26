import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/sass/styles.scss";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/styles/App.css";
import Nav from "./InterviewerNav";
const Dashboard = (props) => {
  const [state, setState] = useState({
    interviews: [],
    events: [],
    currInterview: null,
  });
  const { interviews, events, currInterview } = state;

  const localizer = momentLocalizer(moment);
  function onEventClick(event) {
    console.log(event);
    setState({ ...state, currInterview: event });
  }

  function fetchData() {
    var userID = Cookies.get("userID");
    axios
      .get(`${process.env.REACT_APP_API}/getInterviews/${userID}`)
      .then((response) => {
        if (response.status == 200) {
          setState({ ...state, interviews: response.data });
          createCalendar(response.data);
          localStorage.setItem("interviews", JSON.stringify(response.data));
        } else {
          alert("Could not retrieve interviews!");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Could not retrieve interviews!");
      });
  }

  function createCalendar(interviews) {
    var eventsarr = [];
    for (var x in interviews) {
      var interview = {
        title: "Interview",
        allDay: true,
        start: new Date(moment(interviews[x].date)),
        end: new Date(moment(interviews[x].date)),
        resource: interviews[x],
      };
      eventsarr.push(interview);
    }
    setState({ ...state, events: eventsarr });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      <Nav></Nav>
      <div
        style={{
          marginTop: "2em",
          marginBottom: "3em",
          marginLeft: "8vw",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          &nbsp;&nbsp;Welcome{" "}
          {Cookies.get("firstname") + " " + Cookies.get("lastname")}
        </h2>
        <div style={{ marginTop: "1vw" }}>
          <hr></hr>

          <Row style={{ marginTop: "2vw" }}>
            <Col>
              <Card
                style={{
                  padding: "1em",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 550, width: 800 }}
                  views={["month"]}
                  selectable
                  onSelectEvent={(event) => onEventClick(event)}
                // onSelectSlot={(slotInfo) => this.onSlotChange(slotInfo)}
                />
              </Card>
            </Col>
            <Col>
              <Card className="interview">
                <Card.Title style={{ paddingTop: "1em", textAlign: "center" }}>
                  Interview Details
                </Card.Title>
                <hr></hr>
                {currInterview ? (
                  <Card.Body>
                    <p>
                      <b style={{ color: "#9966cc" }}>Interview Date:</b>
                      &nbsp;&nbsp;
                      {moment(currInterview.resource.date).format("DD/MM/YY")}
                    </p>
                    <p>
                      <b style={{ color: "#9966cc" }}>Interview Time: </b>
                      &nbsp;&nbsp;
                      {moment(currInterview.resource.date).format("hh:mm A")}
                    </p>
                    <p>
                      <b style={{ color: "#9966cc" }}>Link: </b>
                      &nbsp;&nbsp;
                      {currInterview.resource.meetingLink}
                    </p>                      <br></br>

                    <div className="centerItems">
                      <Link
                        to={{
                          pathname: `/InterviewDetails/${currInterview.resource._id}`,
                        }}
                      >
                        <Button className="btn-grad">View Details</Button>
                      </Link>
                    </div>
                  </Card.Body>
                ) : <div className="centerItems"><p>Select an interview from the calendar</p></div>}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <hr></hr>
    </body>
  );
};

export default Dashboard;
