import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import {
  FaHourglassStart,
  FaMoneyCheckAlt,
  FaRegPlayCircle
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import "../../assets/styles/App.css";
import Nav from "./InterviewerNav";
const SearchJob = (props) => {
  const [interview, setInterview] = useState();
  const [skills, setSkills] = useState([]);
  const [applicant, setApplicant] = useState();
  const [feedback, setFeedback] = useState();

  useEffect(() => {
    var interviews = JSON.parse(localStorage.getItem("interviews") || "[]");
    var interview = interviews.find(x => x._id == props.match.params.id)
    setInterview(interview)
    setFeedback(interview.feedback)
    setSkills(interview.jobID.skillset.split(","));
    var userID = interview.applicantID._id;
    axios
      .get(`${process.env.REACT_APP_API}/getApplicantProfile/${userID}`)
      .then((response) => setApplicant(response.data))
      .catch((err) => alert("Could not fetch the details! "));
  }, []);

  function submitFeedback() {
    var feedbackData = { applicantID: interview.applicantID._id, jobID: interview.jobID._id, feedback: feedback, interviewerID: interview.interviewerID }
    axios
      .post(`${process.env.REACT_APP_API}/addFeedback`, feedbackData)
      .then((response) => {
        if (response.status === 200) {
          alert("Feedback Submitted");
        } else {
          alert("Could not submit Feedback! Please try again");
        }
      })
      .catch((err) => alert('Could not submit Feedback!'))
  }

  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      <Nav></Nav>
      <div
        style={{
          marginTop: "2vw",
          marginBottom: "2em",
          marginLeft: "6vw",
        }}
      >
        <Row>
          <Col>
            <Card className="interviewDetailsCard" style={{ width: "40vw" }}>
              {interview ? (
                <>
                  <h3 style={{ color: "black", textAlign: "center" }}>
                    Job Details
                  </h3>
                  <h6 style={{ color: "#BCBCBC" }}>
                    {interview.jobID.companyID.companyName}
                  </h6>
                  <Table
                    style={{
                      color: "#BCBCBC",
                      marginLeft: "-0.5vw",
                    }}
                  >
                    <tr>
                      <td style={{ borderTop: "none" }}>
                        <FaRegPlayCircle></FaRegPlayCircle>&nbsp;Start Date
                      </td>
                      <td style={{ borderTop: "none" }}>
                        <FaMoneyCheckAlt></FaMoneyCheckAlt>&nbsp;Salary
                      </td>
                      <td style={{ borderTop: "none" }}>
                        <FaHourglassStart></FaHourglassStart>&nbsp;Apply By
                      </td>
                      <td style={{ borderTop: "none" }}>
                        <GoLocation></GoLocation>&nbsp;Location
                      </td>
                    </tr>
                    <tr>
                      <td style={{ borderTop: "none" }}>
                        {moment(interview.jobID.startDate).format("YYYY-MM-DD")}
                      </td>
                      <td style={{ borderTop: "none" }}>
                        Rs.{interview.jobID.salary}
                      </td>
                      <td style={{ borderTop: "none" }}>
                        {moment(interview.jobID.applyBy).format("YYYY-MM-DD")}
                      </td>
                      <td style={{ borderTop: "none" }}>
                        {interview.jobID.location}
                      </td>
                    </tr>
                  </Table>
                  <div style={{ color: "black" }}>
                    <hr
                      style={{ marginTop: "-1em", border: "1px solid #BCBCBC" }}
                    ></hr>
                    <h6>Job Title</h6>
                    <p>{interview.jobID.jobTitle}</p>
                    <h6>About the job</h6>
                    <p>{interview.jobID.jobDesc}</p>
                    <h6>Years of Experience</h6>
                    <p>
                      Minimum {interview.jobID.yearsOfExp}
                      {interview.jobID.yearsOfExp == 1 ? " year" : " years"}
                    </p>
                    <h6>Required Skills</h6>
                    <Row style={{ marginLeft: "0.5vw" }}>
                      {skills.map((skill, i) => {
                        return <Card className="skill">{skill}</Card>;
                      })}
                    </Row>
                    <br></br>
                  </div>
                </>
              ) : null}
            </Card>
          </Col>
          <Col>
            <Card className="interviewDetailsCard" style={{ width: "30vw" }}>
              {interview ? (
                <>
                  <h3 style={{ color: "black", textAlign: "center" }}>
                    Applicant Details
                  </h3>
                  <br></br>
                  <hr
                    style={{ marginTop: "-1em", border: "1px solid #BCBCBC" }}
                  ></hr>
                  <div style={{ color: "black", marginLeft: "1vw" }}>
                    <Row>
                      <p>
                        <b>Name:&nbsp;&nbsp;</b>
                        {interview.applicantID.firstname +
                          " " +
                          interview.applicantID.lastname}
                      </p>
                    </Row>
                    <Row>
                      <p>
                        <b>Phone:&nbsp;&nbsp;</b>
                        {interview.applicantID.phone}
                      </p>
                    </Row>
                    <Row>
                      <p>
                        <b>Email:&nbsp;&nbsp;</b>
                        {interview.applicantID.email}
                      </p>
                    </Row>
                    <Row>
                      <p>
                        <b>Resume Link:&nbsp;&nbsp;</b>
                        <a rel={'external'} target="_blank" href={applicant ? applicant.resumeLink : null}>{applicant ? applicant.resumeLink : null}</a>
                      </p>
                    </Row>
                    <Row>
                      <p>
                        <b>Feedback</b>
                      </p>
                    </Row>
                    <Row>
                      <textarea
                        value={feedback}
                        onChange={(event) => {
                          setFeedback(event.target.value);
                        }}
                        style={{ resize: "none" }}
                        rows="4"
                        cols="40"
                      ></textarea>
                    </Row>
                  </div>
                  <br></br>
                  <div className="centerItems">
                    {" "}
                    <Button
                      className="btn-grad"
                      onClick={() => submitFeedback()}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                  <br></br>
                </>
              ) : null}
            </Card>
          </Col>
        </Row>
      </div>
    </body>
  );
};

export default SearchJob;
