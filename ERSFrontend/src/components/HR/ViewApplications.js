

import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, Card, CardGroup, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../assets/styles/hr.css';
import Nav from "./hrnav";
import PaginationBar from './Pagination';
//import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
//import Slider from "./Slider.js";

const ViewApplications = (props) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState("");
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentJobs = jobs.slice(indexOfFirstPost, indexOfLastPost);
  const [Active, setActivePage] = useState(1);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActivePage(pageNumber)
  }

  const search = () => {
    var filterValues = {};
    if (filter.jobID) filterValues.jobID = filter.jobID;
    if (filter.jobTitle) filterValues.jobTitle = filter.jobTitle;

    axios
      .post(`${process.env.REACT_APP_API}/searchJobs`, { ...filterValues, companyID: Cookies.get('companyID') })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data)
          setJobs(response.data);
        } else {
          alert("Could not retrieve jobs!");
        }
      })
      .catch((error) => {
        alert("Could not retrieve jobs!");
      });
  };


  const fetchJobs = (companyID) => {
    axios.get(`${process.env.REACT_APP_API}/getJobOpenings/${companyID}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setJobs(response.data);
        } else {
          alert("Could not retrieve Jobs!");
        }
      })

      .catch((error) => { alert("Could not load jobs") });
  };

  function handleChange(name, event) {
    const filterValues = { ...filter };
    filterValues[name] = event.target.value;
    setState({ ...state, filter: filterValues });
  }
  useEffect(() => {
    var currpage = props.match.params.page;
    setPage(currpage);
    if (currpage === "EditJob") {
      var companyID = Cookies.get("companyID");
      fetchJobs(companyID);
      search();
    }
  }, []);


  const [state, setState] = useState({
    jobOpenings: [],
    filter: {
      jobID: null,
      jobTitle: null,
    },
  });

  const { jobOpenings, filter } = state;

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
        <h2 style={{ textAlign: "center" }}>&nbsp;&nbsp;View Applications</h2>
        <div
          style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "2vw" }}

        >
          <Form.Row>
            <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                size="sm"
                input type="text"
                placeholder="Enter the Job Title"
                value={filter.jobTitle}
                onChange={(event) => handleChange("jobTitle", event)}
                onKeyPress={(event) => { if (event.keyCode == 13) search() }}
              />
            </Form.Group>
            <Form.Group as={Col} md="1">
              <Button
                style={{ marginTop: "1.7em", height: "2em" }}
                variant="primary"
                type="submit"
                onClick={() => search()}
              > Search
              </Button>{" "}
            </Form.Group>
          </Form.Row>
          <br></br>
          <hr style={{ marginTop: "-1vw" }}></hr>
          <div style={{ marginLeft: "3vw" }} >
            <CardGroup className="carddeck" >

              {jobs
                ? jobs.map((job, index) => {
                  return (
                    <Row>
                      <Card
                        className="jobCard"
                      >
                        <Card.Body>
                          <Card.Title className="titleCenter" style={{ color: "#e594e7" }}>
                            {job.jobTitle}<br></br>
                          </Card.Title>
                          <hr style={{ marginTop: "-0.5vw" }}></hr>
                          <Row>
                            <Card.Text style={{ color: "white" }}>
                              <br></br>
                            </Card.Text>
                            <div className="centerItems">
                              <Link to={`/JobApplications/${job._id}`}>
                                <Button className="btn-grad">View Applications</Button>
                              </Link>
                              <br></br>
                            </div>
                          </Row>
                          <br></br>
                        </Card.Body>
                      </Card>
                    </Row>
                  );
                })
                : null}
            </CardGroup>
            <br></br>

          </div>
          <div className="centerItems" style={{ marginTop: "1em" }}>
            <PaginationBar postsPerPage={postsPerPage} totalPosts={jobs.length} paginate={paginate} ActivePage={Active} />
          </div>
        </div>
      </div>
    </body >
  );
};

export default ViewApplications;

