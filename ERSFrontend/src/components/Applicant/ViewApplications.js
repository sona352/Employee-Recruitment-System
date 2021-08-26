import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, CardGroup, Row } from "react-bootstrap";
import { GoLocation } from "react-icons/go";
import { Link } from "react-router-dom";
import "../../assets/styles/App.css";
import Nav from "./ApplicantNav";
import PaginationBar from "./Pagination";

const SearchJob = (props) => {
  const [Applications, setApplications] = useState([]);

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [postsPerPage, setPostsPerPage] = useState(8);

  const indexOfLastPost = currentPage * postsPerPage;

  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentJobs = Applications.slice(indexOfFirstPost, indexOfLastPost);

  const [Active, setActivePage] = useState(1);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActivePage(pageNumber);
  };

  const fetchApplications = () => {
    var userID = Cookies.get("userID");
    axios
      .get(`${process.env.REACT_APP_API}/getApplicationStatus/${userID}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setApplications(response.data);
        } else {
          alert("Could not applications!");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Could not retrieve applications!");
      });
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      <Nav></Nav>
      <div
        style={{
          marginTop: "2em",
          width: "90%",
          marginBottom: "3em",
        }}
      >
        <h2 style={{ textAlign: "center" }}>&nbsp;&nbsp;Job Applications</h2>
        <div
          style={{ marginTop: "2vw" }}
        >
          <hr style={{ marginTop: "-1vw", marginLeft: "4vw" }}></hr>
          <div className="centerItems">
            <CardGroup className="carddeck">
              {Applications.map((appl, index) => {
                return (
                  <Row>
                    <Card className="applCard">
                      <Card.Body>
                        <Card.Title style={{ color: "#9966cc" }}>
                          <Link to={`/Applicant/JobDetails/${appl.jobID._id}`}>
                            {appl.jobID.jobTitle +
                              " at " +
                              appl.jobID.companyID.companyName}
                          </Link>
                          <br></br>
                        </Card.Title>
                        <Row>
                          <GoLocation
                            size={15}
                            style={{ color: " white", marginLeft: "0.7vw" }}
                          ></GoLocation>
                          <p>&nbsp;&nbsp;{appl.jobID.location}</p>
                        </Row>
                        <hr style={{ marginTop: "-0.5vw" }}></hr>
                        <Card.Text>
                          <h6>
                            Date Applied:&nbsp;&nbsp;
                            {moment(appl.applicationDate).format("DD/MM/YY")}
                          </h6>
                          <h6>Job Status:&nbsp;&nbsp;{appl.jobStatus}</h6>
                          <h6>
                            Interview Status:&nbsp;&nbsp;{appl.interviewStatus}
                          </h6>
                          {appl.interviewStatus === "Scheduled" ? (
                            <>
                              <h6>
                                Interview Date:&nbsp;&nbsp;
                                {moment(appl.interviewID.date).format(
                                "DD/MM/YY"
                              )}
                              </h6>
                              <h6>
                                Meeting Link:&nbsp;&nbsp;
                                {appl.interviewID.meetingLink}
                              </h6>
                            </>
                          ) : appl.interviewStatus === "Completed" &&
                            appl.interviewID.feedback !== " " ? (
                            <h6>
                              Feedback:&nbsp;&nbsp;{appl.interviewID.feedback}
                            </h6>
                          ) : null}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Row>
                );
              })}
            </CardGroup>
            <br></br>
          </div>
          <div className="centerItems" style={{ marginTop: "1em" }}>
            <PaginationBar
              postsPerPage={postsPerPage}
              totalPosts={Applications.length}
              paginate={paginate}
              ActivePage={Active}
            />
          </div>
        </div>
      </div>
    </body>
  );
};

export default SearchJob;
