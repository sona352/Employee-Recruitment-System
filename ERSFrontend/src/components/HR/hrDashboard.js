import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import Nav from "./hrnav";
import axios from 'axios';
import Cookies from 'js-cookie';

const Dashboard = (props) => {

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState([]);
  const fetchJobs = (companyID) => {
    axios.get(`${process.env.REACT_APP_API}/getJobOpenings/${companyID}`)
      .then((response) => {
        if (response.status == 200) {
          setJobs(response.data);
        } else {
          alert("Could not retrieve Jobs!");
        }
      })
      .catch((error) => { alert("Could not load jobs!") });
  };

  const fetchCompany = (companyID) => {
    axios.get(`${process.env.REACT_APP_API}/getCompany/${companyID}`)
      .then((response) => {
        if (response.status == 200) {
          setCompany(response.data);
        } else {
          alert("Could not retrieve company details!");
        }
      })
      .catch((error) => { alert("Could not retrieve company details!") });
  };


  useEffect(() => {
    var companyID = Cookies.get("companyID");
    fetchJobs(companyID);
    fetchCompany(companyID);
  }, []);


  return (
    <body style={{ backgroundColor: "#151936", color: "white" }}>
      <Nav></Nav>
      <div
        style={{
          marginLeft: "3em",
          marginRight: "3em",
          marginTop: "3em",
          marginBottom: "3em",
        }}
      >
        <h2>
          &nbsp;&nbsp;Welcome {Cookies.get("firstname")} {Cookies.get("lastname")}
        </h2>
        <br></br>
        <div style={{ marginLeft: "1vw", marginRight: "3vw", marginTop: "1vw" }}>
          <hr></hr>
          
          <h5>Current Date: {new Date().toLocaleDateString()}</h5>
          <h5>Use the links in the nav bar to the left to access the different functionalities.</h5>
          <hr></hr>
          <br></br>
          <br></br>
          <Row style={{ marginTop: "1vw" }}>
            <Col>
              <Card
                style={{
                  backgroundColor: "#24518d",
                  height: "280px",
                  width: "410px",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h2>Current Job Openings:</h2>
                  </Card.Title>
                  Job titles for the current openings are:
                  <br /><br />
                  {jobs ? jobs.map((job, index) => {
                    return (
                      <h5>
                        {index + 1}.  {job.jobTitle} <br></br>
                      </h5>)
                  })
                    : null}
                  <br />
                    Job details can be updated in the Edit Job Opening tab.
                    You can also update the job status for applicants in the view applications tab.
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                style={{
                  backgroundColor: '#d16d98',
                  height: "280px",
                  width: "410px",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h2>Company Details:</h2>
                  </Card.Title>
                  {
                    company
                      ?
                      <>
                        <h5>Company Name:</h5> {company.companyName}
                        <h5>Company Description:</h5> {company.companyDesc}
                        <h5>Location:</h5> {company.location}
                        <h5>Website:</h5> {company.website}
                      </>
                      :
                      null
                  }
                  <br />

                </Card.Body>
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



