import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap";
import {
  FaHourglassStart,
  FaMoneyCheckAlt,
  FaRegPlayCircle
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import "../../assets/styles/App.css";
import Nav from "./ApplicantNav";
const SearchJob = (props) => {
  const [job, setJob] = useState();
  const [skills, setSkills] = useState([]);
  const [apply, setApply] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const fetchJob = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/getJobOpening/${props.match.params.id}`
      )
      .then((response) => {
        if (response.status == 200) {
          setJob(response.data);
          setSkills(response.data.skillset.split(","));
        } else {
          alert("Could not retrieve job!");
        }
      })
      .catch((error) => {
        alert("Could not retrieve job!");
      });
  };

  const sendEmail = () => {
    var userID = Cookies.get("userID");
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API}/getApplicantProfile/${userID}`),
        axios.get(`${process.env.REACT_APP_API}/getProfile/${userID}`),
      ])
      .then(
        axios.spread((obj1, obj2) => {
          var user = obj2.data;
          var applicant = obj1.data;
          axios
            .post(`${process.env.REACT_APP_API}/applicationEmail`, {
              user,
              applicant,
              job,
            })
            .then((response) => {
              window.location.reload()
            })
            .catch((error) => {
              console.log("email could not be sent");
              window.location.reload()
            });
        })
      )
      .catch((error) => {
        console.log(error);
      });
  };
  const applyJob = () => {
    var application = {};
    setDisableSubmit(true);
    application.jobID = props.match.params.id;
    application.applicantID = Cookies.get("userID");
    axios
      .post(`${process.env.REACT_APP_API}/applyJob`, application)
      .then((response) => {
        if (response.status == 200) {
          alert("Application Successful");
          sendEmail();
        } else {
          alert("Could not apply!");
          setDisableSubmit(false);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Could not apply!");
        setDisableSubmit(false);
      });
  };
  function checkIfApplied() {
    var userID = Cookies.get("userID");
    axios
      .get(`${process.env.REACT_APP_API}/getApplicationStatus/${userID}`)
      .then((response) => {
        var apply = true;
        for (var x in response.data) {
          if (response.data[x].jobID._id === props.match.params.id)
            apply = false;
        }
        setApply(apply);
      })
      .catch((error) => {
        alert("Could not load job! Please try again");
      });
  }

  useEffect(() => {
    fetchJob();
    checkIfApplied();
  }, []);

  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      <Nav></Nav>
      <div
        style={{
          marginTop: "2vw",
          marginBottom: "2em",
        }}
      >
        <div>
          <Card
            className="applyCard"
            style={{ padding: "1em", borderRadius: "1em" }}
          >
            <h2 style={{ textAlign: "center", color: "#9966cc" }}>
              {job ? job.jobTitle : null} at{" "}
              {job ? job.companyID.companyName : null}
            </h2>
          </Card>
          <hr className="applyCard"></hr>
          <Card
            className="applyCard"
            style={{
              paddingLeft: "6em",
              paddingRight: "6em",
              paddingBottom: "2em",
              paddingTop: "2em",
              borderRadius: "1em",
            }}
          >
            {job ? (
              <>
                <h5 style={{ color: "black" }}>{job.jobTitle}</h5>
                <h6 style={{ color: "#BCBCBC" }}>
                  {job.companyID.companyName}
                </h6>
                <Table
                  style={{
                    color: "#BCBCBC",
                    width: "70%",
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
                      {moment(job.startDate).format("YYYY-MM-DD")}
                    </td>
                    <td style={{ borderTop: "none" }}>Rs.{job.salary}</td>
                    <td style={{ borderTop: "none" }}>
                      {moment(job.applyBy).format("YYYY-MM-DD")}
                    </td>
                    <td style={{ borderTop: "none" }}>{job.location}</td>
                  </tr>
                </Table>
                <div style={{ color: "black" }}>
                  <hr
                    style={{ marginTop: "-1em", border: "1px solid #BCBCBC" }}
                  ></hr>
                  <h6>About {job.companyID.companyName}</h6>
                  <p>{job.companyID.companyDesc}</p>
                  <h6>About the job</h6>
                  <p>{job.jobDesc}</p>
                  <h6>Years of Experience</h6>
                  <p>
                    Minimum {job.yearsOfExp}
                    {job.yearsOfExp == 1 ? " year" : " years"}
                  </p>
                  <h6>Required Skills</h6>
                  <Row style={{ marginLeft: "0.5vw" }}>
                    {skills.map((skill, i) => {
                      return <Card className="skill">{skill}</Card>;
                    })}
                  </Row>
                  <br></br>
                  {apply ? (
                    <div className="centerItems" onClick={() => applyJob()}>
                      <Button className="btn-grad" disabled={disableSubmit}>Apply Job</Button>
                    </div>
                  ) : (
                    <div className="centerItems">
                      <h5>You have already applied for this job</h5>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </Card>
        </div>
      </div>
    </body>
  );
};

export default SearchJob;
