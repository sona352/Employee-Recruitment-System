import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../assets/styles/hr2.css';
import Nav from "./hrnav";
import PaginationBar from './Pagination';
//import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
//import Slider from "./Slider.js";

const ApplicantDetails = (props) => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState("");
  const [applData, setapplData] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    },
    dob: "",
    percent10: "",
    percent12: "",
    gradDetails: {
      degreeType: "",
      yearPassOut: "",
      cgpa: "",
      university: "",
      country: ""
    },
    resumeLink: "",
    nationality: "",
    locationPref: ""
  });
  const [applStatus, setapplStatus] = useState(
    {
      jobID: {
        companyID: {
          _id: "",
          companyName: "",
          companyDesc: "",
          location: "",
          website: ""
        },
        _id: "",
        jobTitle: "",
        jobDesc: "",
        salary: "",
        skillset: "",
        startDate: "",
        applyBy: "",
        location: "",
        yearsOfExp: ""
      },
      interviewID: {
        _id: "",
        applicantID: "",
        interviewerID: "",
        jobID: "",
        date: "",
        meetingLink: "",
        feedback: ""
      },
      applicantID: "",
      applicationDate: "",
      interviewStatus: "",
      jobStatus: ""
    }


  )
  const [proData, setproData] = useState({});
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
  const fetchApplication = () => {
    axios.get(`${process.env.REACT_APP_API}/getApplicantProfile/${props.match.params.id1}`)
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

  };

  const fetchProfile = () => {
    axios.get(`${process.env.REACT_APP_API}/getProfile/${props.match.params.id1}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          //   setState({...state,applData:response.data});
          setproData(response.data);
        }
        else {
          alert("Could not retrieve Profile!");
        }
      })

      .catch((error) => { console.log(error); alert("Could not load Profile") });
  }
  const fetchStatus = () => {
    axios.get(`${process.env.REACT_APP_API}/getApplicationStatus/${props.match.params.id1}`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          //   setState({...state,applData:response.data});
          setapplStatus(response.data);
        }
        else {
          alert("Could not retrieve Profile!");
        }
      })

      .catch((error) => { console.log(error); alert("Could not load Profile") });

  }

  useEffect(() => {
    var currpage = props.match.params.page;
    setPage(currpage);
    fetchApplication();
    fetchProfile();
    fetchStatus();
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
        <h2 style={{ marginLeft: "8vw", marginRight: "3vw", marginTop: "-1.5vw" }}>&nbsp;&nbsp;Applicant Details</h2>
        <br></br>
        {/* <hr style={{ marginTop: "0.2vw", marginLeft: "8vw" }}></hr> */}
        <div
          //   style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "1vw" }}
          style={{
            marginLeft: page === "ApplicantDetails" ? "9vw" : "9vw",
            marginTop: "-1em",
            marginBottom: "3em",
          }}

        >
          <div style={{ fontWeight: "bold", fontSize: "15px" }}>
            <Form.Row>
              <Form.Group>
                <Card
                  style={{
                    backgroundColor: "f4f9f9",
                    height: "47.9vw",
                    width: "55vw",
                    borderRadius: "2em",
                  }}
                >
                  <Card.Body
                    style={{
                      marginTop: "1vw",
                      paddingLeft: "6em",
                      paddingRight: "7em",
                      color: 'Black',
                      fontSize: '15px'
                    }}
                  >
                    <Form.Row>
                      <Form.Group as={Col} md="5" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>First Name: </Form.Label>
                        <Form.Control
                          value={proData.firstname}

                        />
                      </Form.Group>

                      <Form.Group as={Col} md="5" style={{ margLeft: "0.2vw" }}>
                        <Form.Label>Last Name: </Form.Label>
                        <Form.Control
                          value={proData.firstname}

                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="5" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Email: </Form.Label>
                        <Form.Control value={proData.email} />
                      </Form.Group>
                      <Form.Group as={Col} md="5" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Phone: </Form.Label>

                        <Form.Control value={proData.phone} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="10" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Address: </Form.Label>
                        <Form.Control value={applData.address.street, applData.address.city, applData.address.state, applData.address.pincode, applData.address.country} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="4" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Date of Birth: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="3">
                        <Form.Control value={moment(applData.dob).format("DD/MM/YY")} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="3" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>% scored in 10th: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                        <Form.Control value={applData.percent10} />
                      </Form.Group>
                      <Form.Group as={Col} md="3" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>% scored in 12th: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        <Form.Control value={applData.percent12} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col} md="5" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Degree Type: </Form.Label>
                        <Form.Control value={applData.gradDetails.degreeType} />
                      </Form.Group>

                      <Form.Group as={Col} md="3" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Year Of Passing Out: </Form.Label>

                        <Form.Control value={applData.gradDetails.yearPassOut} />
                      </Form.Group>
                      <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>CGPA: </Form.Label>
                        <Form.Control value={applData.gradDetails.cgpa} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="4" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>University: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Control value={applData.gradDetails.university} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="4" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Resume Link: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Control value={applData.resumeLink} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="4" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Nationality: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Control value={applData.nationality} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} md="4" style={{ marginRight: "0.5vw" }}>
                        <Form.Label>Location Preference: </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md="6">
                        <Form.Control value={applData.locationPref} />
                      </Form.Group>
                    </Form.Row>

                  </Card.Body>

                </Card>
              </Form.Group>
              <Form.Group>
                <Card style={{
                  backgroundColor: "#272a3d",
                  width: "19rem",
                  marginLeft: "2em",
                  marginRight: "2em",
                  marginTop: "10vw",
                  borderRadius: "1em"
                }}>
                  <Card.Body>
                    <Card.Title className="titleCenter" style={{ color: "#e594e7" }}>
                      Interview Status
                           <br></br>
                    </Card.Title>
                    <hr style={{ marginTop: "-0.5vw" }}></hr>
                    <Card.Text style={{ color: "white" }}>
                      <Form.Row>
                        <Form.Group>
                          {applStatus.interviewStatus === "Scheduled" ? <Card.Text style={{ textAlign: "center" }}> Interview Scheduled!</Card.Text> : <Link to={`/ScheduleIntr/${props.match.params.id1}/${props.match.params.id2}`}>
                            <Button className="btns-grad" >Schedule</Button>
                          </Link>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                          <Link to={`/JobApplications/${props.match.params.id2}`}>
                            <Button className="btns-grad" >Go Back</Button>
                          </Link>
                        </Form.Group>
                      </Form.Row>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Form.Group>
            </Form.Row>
          </div>


        </div>
        <div className="centerItems" style={{ marginTop: "1em" }}>
          <PaginationBar postsPerPage={postsPerPage} totalPosts={jobs.length} paginate={paginate} ActivePage={Active} />
        </div>
      </div>
    </body >
  );
};

export default ApplicantDetails;



