import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import { useHistory } from "react-router-dom";
import { ReactSmartScroller } from "react-smart-scroller";
import Nav from "./ApplicantNav";

const Dashboard = (props) => {
  let history = useHistory();

  function pieChart(appl) {
    var chart = {};
    var month = [];
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var currYear = new Date().getFullYear();
    for (var i = 0; i < appl.length; i++) {
      var date = new Date(appl[i].applicationDate);
      if (currYear === date.getFullYear()) {
        if (chart[month[date.getMonth()]]) chart[month[date.getMonth()]] += 1;
        else chart[month[date.getMonth()]] = 1;
      }
    }
    var pie = chartarr;
    console.log(pie);
    var entries = Object.entries(chart);
    for (var x in entries) pie.push(entries[x]);
    console.log(pie);
    setState({ ...state, chartarr: pie });
  }
  function fetchData(userID) {
    axios
      .all([
        axios.get(
          `${process.env.REACT_APP_API}/getApplicationStatus/${userID}`
        ),
      ])
      .then(
        axios.spread((obj1) => {
          console.log(obj1.data);
          pieChart(obj1.data);
          var initial = 0;
          var interview = 0;
          var interviewAppl = [];
          var offerAppl = [];
          for (var x in obj1.data) {
            if (obj1.data[x].interviewStatus === "Not Scheduled") initial++;
            else if (obj1.data[x].interviewStatus === "Scheduled") {
              interview++;
              interviewAppl.push(obj1.data[x]);
            } else if (obj1.data[x].jobStatus === "Offered") {
              offerAppl.push(obj1.data[x]);
            }
          }
          setState({
            ...state,
            applications: obj1.data,
            initialCount: initial,
            interviewCount: interview,
            interviewApplications: interviewAppl,
            offerApplications: offerAppl,
          });
        })
      )
      .catch((error) => {
        alert("Could not load data");
      });
  }

  useEffect(() => {
    var userID = Cookies.get("userID");
    fetchData(userID);
  }, []);
  const renderAppl = () => {
    return applications.map((appl, index) => (
      <Card
        style={{
          borderRadius: "1em",
          padding: "1vw",
          marginBottom: "1vw",
          color: "black",
          textAlign: "center",
        }}
        onClick={() => {
          history.push(`/Applicant/JobDetails/${appl.jobID._id}`);
        }}
      >
        <h6>
          {appl.jobID.jobTitle + " at " + appl.jobID.companyID.companyName}
        </h6>
      </Card>
    ));
  };

  const [state, setState] = useState({
    applications: [],
    initialCount: 0,
    interviewCount: 0,
    chartarr: [["Month", "Applications"]],
    interviewApplications: [],
    offerApplications: [],
  });
  const {
    applications,
    initialCount,
    interviewCount,
    chartarr,
    interviewApplications,
    offerApplications,
  } = state;
  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      <Nav></Nav>
      <div
        style={{
          marginTop: "3em",
          marginBottom: "3em",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          &nbsp;&nbsp;Welcome{" "}
          {Cookies.get("firstname") + " " + Cookies.get("lastname")}
        </h2>
        <div
          style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "2vw" }}
        >
          <hr></hr>

          <Row style={{ marginTop: "3vw" }}>
            <Col>
              <Card
                style={{
                  backgroundColor: "#272a3d",
                  height: "34vw",
                  width: "20vw",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Jobs Applied</h3>
                  </Card.Title>
                  <hr></hr>
                  <Card.Text>
                    {applications == [] ? (
                      <h4>No Applications yet!</h4>
                    ) : (
                      <ReactSmartScroller vertical style={{ height: "27vw" }}>
                        {renderAppl()}
                      </ReactSmartScroller>
                    )}

                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  backgroundColor: "#272a3d",
                  height: "16.25vw",
                  marginBottom: "1.5vw",
                  width: "22vw",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Upcoming Interviews</h3>
                    <hr></hr>
                  </Card.Title>
                  {interviewApplications.length == 0 ? (
                    <h6>No interviews coming up!</h6>
                  ) : (
                    <Splide
                      options={{
                        type: "loop",
                        autoplay: true,
                        pauseOnHover: false,
                        resetProgress: false,
                      }}
                    >
                      {interviewApplications.map((appl, id) => {
                        return (
                          <SplideSlide>
                            {" "}
                            <Card
                              className="intCard"
                              onClick={() => {
                                history.push(`/Applicant/JobDetails/${appl.jobID._id}`);
                              }}
                            >
                              <Card.Body>
                                {appl.jobID.jobTitle +
                                  " at " +
                                  appl.jobID.companyID.companyName}
                                <br></br>
                                Interview Date:&nbsp;&nbsp;
                                {moment(appl.interviewID.date).format(
                                  "DD/MM/YY"
                                )}
                                <br></br>
                                Time:&nbsp;&nbsp;
                                {moment(appl.interviewID.date).format(
                                  "hh:mm A"
                                )}
                                <br></br>
                                <a
                                  target="_blank"
                                  href={appl.interviewID.meetingLink}
                                >
                                  {appl.interviewID.meetingLink}
                                </a>
                              </Card.Body>
                            </Card>
                          </SplideSlide>
                        );
                      })}
                    </Splide>
                  )}
                </Card.Body>
              </Card>
              <Card
                style={{
                  backgroundColor: "#272a3d",
                  height: "16.25vw",
                  width: "22vw",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Offers Received</h3>
                    <hr></hr>
                  </Card.Title>
                  <Card.Text>
                    {offerApplications.length == 0 ? (
                      <h6>No offers yet</h6>
                    ) : (
                      <Splide
                        options={{
                          type: "loop",
                          gap: "1rem",
                          autoplay: true,
                          pauseOnHover: false,
                          resetProgress: false,
                          arrows: "slider",
                        }}
                      >
                        {offerApplications.map((appl, id) => {
                          return (
                            <SplideSlide>
                              {" "}
                              <Card className="intCard">
                                <Card.Body>
                                  <Card.Title style={{ color: "#9966cc" }}>
                                    {appl.jobID.companyID.companyName +
                                      " " +
                                      appl.jobID.location}
                                    <br></br>
                                  </Card.Title>
                                  <p>{appl.jobID.jobTitle}</p>
                                </Card.Body>
                              </Card>
                            </SplideSlide>
                          );
                        })}
                      </Splide>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  backgroundColor: "#272a3d",
                  height: "22vw",
                  marginBottom: "1.5vw",
                  width: "26vw",
                }}
                className="center"
              >
                <Card.Body>
                  <h6 style={{ textAlign: "center" }}>
                    Month Wise Applications in {new Date().getFullYear()}
                  </h6>
                  <Card.Text>
                    <Chart
                      chartType="PieChart"
                      data={chartarr}
                      options={{
                        legend: "none",
                        pieSliceText: "label",
                        pieStartAngle: 100,
                        width: 370,
                        height: 280,
                        chartArea: { width: "80%", height: "80%" },
                        backgroundColor: "#272a3d",
                        colors: ["#e73968", "#4f34f4", "#4E83FE", "#0eb078"],
                      }}
                    />
                  </Card.Text>
                </Card.Body>
              </Card>
              <Row>
                <Col>
                  <Card
                    className="card1"
                  >
                    <Card.Body>
                      <h1 style={{ fontSize: "3em" }}>{initialCount}</h1>
                      <Card.Text>
                        {initialCount === 1 ? "Application" : "Applications"} at
                        initial stage
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card
                    className="card1"
                  >
                    <Card.Body>
                      <h1 style={{ fontSize: "3em" }}>{interviewCount}</h1>
                      <Card.Text>
                        {initialCount === 1 ? "Application" : "Applications"} at
                        interview stage
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <hr></hr>
    </body>
  );
};

export default Dashboard;
