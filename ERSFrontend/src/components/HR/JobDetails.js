import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, CardGroup, Row } from "react-bootstrap";
import { Button, Col, Form } from "react-bootstrap";
import { GoLocation } from "react-icons/go";
import { Link } from "react-router-dom";
//import "../../assets/styles/App.css";
import Nav from "./hrnav";
//import PaginationBar from "./Pagination";

const EditJob = (props) => {
    const [disablesubmit, setDisableSubmit] = useState(false);
    const [skills, setSkills] = useState([]);
    const [page, setPage] = useState("");
    const [state, setState] = useState({
        
        jobData: {
            companyID:"",
            jobID:"",
            jobTitle: "",
            jobDesc: "",
            salary: "",
            skillset: "",
            startDate:"",
            applyBy:"",
            location: "",
            yearsOfExp: "",
        }
    });
    // var companyid;
    // var jobid;
    const {jobData} = state;
    const fetchJob = () => {
        axios
          .get(
            `${process.env.REACT_APP_API}/getJobOpening/${props.match.params.id}`
          )
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data);
            //   console.log(response.data.jobID)
            //   companyid=response.companyID._id;
            //   jobid=response.jobID;
              setState({jobData:response.data});
              setSkills(response.data.skillset.split(","));
            } else {
              alert("Could not update job!");
            }
          })
          .catch((error) => {
            alert("Could not update job!");
          });
      };
      useEffect(() => {
          fetchJob();
      }, []);

      const handleJobDataChange = (name, event) => {
        var job = { ...jobData };
        job[name] = event.target.value;
        setState({ ...state, jobData: job });
      };

      const updateJob = (event) => {
        event.preventDefault();
        setDisableSubmit(true);
        var NewJobData=jobData;
       NewJobData.companyID=jobData.companyID._id;
       NewJobData.jobID=props.match.params.id;
        console.log(NewJobData)
        axios
          .post(`${process.env.REACT_APP_API}/updateJobOpening`, NewJobData)
          .then((response) => {
            console.log(response);

            if (response.status === 200) 
            {
                
                  alert("Job updated Successfully!");
                  
              } 
              else 
              {
                  alert("Could not Update Job Opening! Please try again");
                //   window.location.reload();
              }
            })
            .catch((error) => {
                console.log(error);
                alert("Could not Update Job Opening! Please try again");
                window.location.reload();
            });
      };

      return (
        <body style={{ backgroundColor: "#1f1e2e", color: "black" }}>
          <Nav/>
          <div
            style={{
              marginLeft: page === "JobDetails" ? "10vw" : "14vw",
              marginTop: "2em",
              marginBottom: "3em",
            }}
          >
    
                <Card
              style={{
                backgroundColor: "f4f9f9",
                height: "48vw",
                width: "60vw",
                borderRadius: "2em",
              }}
            >
                <Card.Body
                  style={{
                    marginTop: "1vw",
                    paddingLeft: "6em",
                    paddingRight: "7em",
                    color:'#0000FF',
                    fontSize:'15px'
                  }}
                >
    
                  <form
                    onSubmit={(event) => {
                      
                        updateJob(event);
                        
                    }}
                  >
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Job Title</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.jobTitle : null}
                          placeholder="Enter Job Title"
                          onChange={(event) => {
                            handleJobDataChange("jobTitle", event);
                          }}
                          required
                        />
                      </Form.Group>
                      {/* <Form.Group as={Col}>
                        <Form.Label className="formlabel">Last Name</Form.Label>
                        <Form.Control
                          value={profileData ? profileData.lastname : null}
                          placeholder="Enter Last Name"
                          onChange={(event) => {
                            handleProfileDataChange("lastname", event);
                          }}
                          required
                        />
                      </Form.Group> */}
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Job Desc</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.jobDesc : null}
                          placeholder="Enter Job Description"
                          onChange={(event) => {
                            handleJobDataChange("jobDesc", event);
                          }}
                          required
                        />
                      </Form.Group>
                      </Form.Row>
                     
                      <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Salary</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.salary : null}
                          placeholder="Enter Salary"
                          onChange={(event) => {
                            handleJobDataChange("salary", event);
                          }}
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Skill Set</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.skillset : null}
                          placeholder="Enter Skills required"
                          onChange={(event) => {
                            handleJobDataChange("skillset", event);
                          }}
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Start Date</Form.Label>
                        <Form.Control
                          value={jobData ? moment(jobData.startDate).format("YYYY-MM-DD") : null}
                          type="date"
                          onChange={(event) => {
                            handleJobDataChange("startDate", event);
                          }}
                          required
                        />
                      </Form.Group>
            
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Apply By</Form.Label>
                        <Form.Control
                          value={jobData ? moment(jobData.applyBy).format("YYYY-MM-DD") : null}
                          type="date"
                          onChange={(event) => {
                            handleJobDataChange("applyBy", event);
                          }}
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Location</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.location : null}
                          placeholder="Enter the Location"
                          onChange={(event) => {
                            handleJobDataChange("location", event);
                          }}
                          required
                        />
                        </Form.Group>
                        </Form.Row>
                        <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label className="formlabel">Years Of Experience</Form.Label>
                        <Form.Control
                          value={jobData ? jobData.yearsOfExp : null}
                          placeholder="Enter the no.of years of Experience required"
                          onChange={(event) => {
                            handleJobDataChange("yearsOfExp", event);
                          }}
                          required
                        />
                        </Form.Group>
                        </Form.Row>
            { <div className="center">
              {page === "JobDetails" ? (
                <Button type="submit" variant="primary">
                  Next
                </Button>
              ) : (
                <Button variant="primary" type="submit" disabled={disablesubmit}>
                  Submit
                </Button>
              )}
            </div> }
          </form>
        </Card.Body>
      
        </Card> 
    
          </div>
          <hr></hr>
        </body>
      );  
        
      };
      export default EditJob;




