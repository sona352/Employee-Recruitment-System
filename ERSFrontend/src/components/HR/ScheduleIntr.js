import axios from "axios";
import Cookies from "js-cookie";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Nav from "./hrnav";

const ScheduleIntr = (props) => {
  const [state, setState] = useState({
    SchData: {
      applicantID: "",
      interviewerID: "",
      jobID: "",
      date: "",
      meetingLink: ""
    }
  });
  const { SchData } = state;
  const [applStatus, setapplStatus] = useState([])
  const [disablesubmit, setDisableSubmit] = useState(false);
  const [intr, setIntr] = useState([])
  var appid = props.match.params.id;
  const fetchStatus = () => {
    axios.get(`${process.env.REACT_APP_API}/getApplicationStatus/${props.match.params.id1}/${props.match.params.id2}`)
      .then((response1) => {
        if (response1.status == 200) {
          console.log(response1.data);
          setapplStatus(response1.data);
          axios.get(`${process.env.REACT_APP_API}/getInterviewerList/${response1.data.jobID.companyID._id}`)
            .then((response2) => {
              if (response2.status == 200) {
                console.log(response2.data);
                setIntr(response2.data);
                if (response2.data.length) {
                  setState({ SchData: { ...SchData, interviewerID: response2.data[0]._id } })
                }
                //setSkills(setJobs.skillset.split(","));
              } else {
                alert("Could not retrieve Jobs!");
              }
            })

            .catch((error) => { alert("Could not load Interviewers") });
        }
        else {
          alert("Could not retrieve Status!");
        }
      })

      .catch((error) => { console.log(error); alert("Could not load Status") });

  };

  useEffect(() => {
    fetchStatus();
    //fetchInterviewers();

  }, []);

  const updateInterview = (event) => {
    console.log("Data", SchData);
    event.preventDefault();
    setDisableSubmit(true);
    var newData = SchData;
    newData.applicantID = props.match.params.id1;
    newData.jobID = props.match.params.id2;
    // console.log("newData",newData);
    axios
      .post(`${process.env.REACT_APP_API}/scheduleInterview`, newData)
      .then((response) => {
        if (response.status === 200) {

          alert("Interview Scheduled!");

        }
        else {
          alert("Error or interview already scheduled!");
          //   window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error)
        alert("Error or interview already scheduled!");
        // window.location.reload();
      });
  };


  const handleScheduleDataChange = (name, event) => {
    var sch = { ...SchData };
    sch[name] = event.target.value;
    console.log(name, event.target.value);
    setState({ ...state, SchData: sch });

  };


  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "black" }}>
      <Nav />
      <Card
        style={{
          backgroundColor: "f4f9f9",
          height: "27vw",
          width: "60vw",
          borderRadius: "2em",
          marginTop: "4em",
          marginLeft: "15em"
        }}
      >
        <Card.Body
          style={{
            marginTop: "1vw",
            paddingLeft: "6em",
            paddingRight: "7em",
            color: '#0000FF',
            fontSize: '15px'
          }}
        >

          <h2 style={{ textAlign: "center" }}>&nbsp;&nbsp;Scheduling Interview</h2>

          <div
            style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "2vw" }}

          >
            <form
              onSubmit={(event) => {

                updateInterview(event);

              }}
            >

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label for="in" className="formlabel">Choose An Interviewer: </Form.Label>
                  <select name="in" id="in" onChange={(event) => {
                    handleScheduleDataChange("interviewerID", event);
                  }}
                  >
                    {intr
                      ? intr.map((intrs) => {

                        return (
                          <option value={intrs ? intrs._id : null} >{intrs.firstname}</option>);


                      })
                      : null} </select>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label className="formlabel">Interview Date and Time</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Control
                    value={state ? (state.date) : null}
                    type="datetime-local"
                    onChange={(event) => {
                      handleScheduleDataChange("date", event);
                    }}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="4">
                  <Form.Label className="formlabel">Meeting Link</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Control
                    value={state ? (state.meetingLink) : null}
                    type="text"
                    onChange={(event) => {
                      handleScheduleDataChange("meetingLink", event);
                    }}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <div >
                <br></br>
                {console.log(applStatus.interviewID)}
                {
                  applStatus.interviewID
                    ?
                    <h2>Interview Already Scheduled</h2>
                    :
                    <Button variant="primary" type="submit" disabled={disablesubmit}>
                      Schedule
                    </Button>
                }
              </div>
            </form>
          </div>
        </Card.Body>

      </Card>

      {/* </div> */}
      <hr></hr>
    </body>
  );
};

export default ScheduleIntr;