import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../assets/styles/hr.css';
import Nav from "./hrnav";
import PaginationBar from './Pagination';
//import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
//import Slider from "./Slider.js";

const JobApplications = (props) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState("");
  const [applData, setapplData] = useState([]);
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
  const [state, setState] = useState({

    jobData: {
      jobTitle: "",
      jobDesc: "",
      salary: "",
      skillset: "",
      startDate: "",
      applyBy: "",
      location: "",
      yearsOfExp: "",
    }
    // applData:null
  });

  var newJobData;
  const { jobData } = state;
  const fetchJob = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/getJobOpening/${props.match.params.id}`
      )
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setState({ jobData: response.data });
          setSkills(response.data.skillset.split(","));
          //  console.log(jobData);
          //   fetchApplications();
          axios.get(`${process.env.REACT_APP_API}/getApplications/${props.match.params.id}`)
            .then((response) => {
              if (response.status == 200) {
                console.log(response.data);
                //   setState({...state,applData:response.data});
                setapplData(response.data);
              }
              else {
                alert("Could not retrieve Applications!");
              }
            })
            .catch((error) => { console.log(error); alert("Could not load Applications") });


        } else {
          alert("Could not load job details!");
        }
      })
      .catch((error) => {
        alert("Could not load job details!");
      });
  };
  //   newJobData = jobData;

  useEffect(() => {
    var currpage = props.match.params.page;
    setPage(currpage);
    fetchJob();
  }, []);


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
        <h2 style={{ marginLeft: "8vw", marginRight: "3vw", marginTop: "1vw" }}>&nbsp;&nbsp;View Job Details</h2>
        <br></br>
        <hr style={{ marginTop: "0.5vw", marginLeft: "8vw" }}></hr>
        <div
          style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "2vw" }}

        >
          <div style={{ fontWeight: "bold", fontSize: "15px" }}>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Job Title</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="2">
                <Form.Label>{jobData.jobTitle}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Job Desc</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>{jobData.jobDesc}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Salary</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="1">
                <Form.Label>{jobData.salary}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Skill Set</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="1">
                <Form.Label>{jobData.skillset}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Location</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="1">
                <Form.Label>{jobData.location}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                <Form.Label>Years Of Exp</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md="1">
                <Form.Label>{jobData.yearsOfExp}</Form.Label>
              </Form.Group>
            </Form.Row>
          </div>
          <br></br>
          <hr style={{ marginTop: "-1vw", marginLeft: "-2vw", marginRight: "-3vw" }}></hr>

          <h2 style={{ marginLeft: "-2vw", marginRight: "3vw", marginTop: "1vw" }}>&nbsp;&nbsp;Applicants</h2>
          <br></br>

          <Table style={{ color: "white", width: "100%" }}>
            <thead>

              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Details</th>
                <th>Job Status</th>
              </tr>
            </thead>

            <tbody>
              {applData
                ? applData.map((appl) => {
                  return (


                    <tr>
                      <th>{appl.applicantData.applicantID.firstname}</th>
                      <th>{appl.applicantData.applicantID.lastname}</th>
                      <th>{appl.applicantData.applicantID.email}</th>
                      <th>{appl.applicantData.applicantID.phone}</th>
                      <th><Link to={`/ApplicantDetails/${appl.applicantData.applicantID._id}/${appl.jobID}`}>
                        <Button className="btns-grad" style={{}}>View Details</Button>
                      </Link> </th>
                      <th><Link to={`/JobStatus/${appl.applicantData.applicantID._id}/${appl.jobID}`}>
                        <Button className="btns-grad" style={{}}>View Status</Button>
                      </Link> </th>
                    </tr>


                  );
                })
                : null}
            </tbody>
          </Table>
          {/* </CardGroup> */}
          <br></br>

        </div>
        <div className="centerItems" style={{ marginTop: "1em" }}>
          <PaginationBar postsPerPage={postsPerPage} totalPosts={jobs.length} paginate={paginate} ActivePage={Active} />
        </div>
      </div>
    </body >
  );
};

export default JobApplications;



