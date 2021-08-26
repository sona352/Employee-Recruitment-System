import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, CardGroup, Col, Form, InputGroup, Row } from "react-bootstrap";
import { GoLocation } from "react-icons/go";
import { Link } from "react-router-dom";
import '../../assets/styles/App.css';
import Nav from "./ApplicantNav";
import PaginationBar from './Pagination';
import Slider from "./Slider.js";
const SearchJob = (props) => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState();

  //for pagination
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
    console.log(filter.companyID)
    if (filter.companyID) filterValues.companyID = filter.companyID;
    if (filter.location) filterValues.location = filter.location;
    filterValues.yearsOfExp = filter.yearsOfExp;
    if (filter.salary.min || filter.salary.max) filterValues.salary = {};
    if (filter.salary.min) {
      filterValues.salary.min = filter.salary.min;
    }
    if (filter.salary.max) {
      filterValues.salary.max = filter.salary.max;
    }
    if (filter.salary.min && filter.salary.max) {
      if (filter.salary.min > filter.salary.max) {
        alert("Minimum salary cannot be greater than maximum!");
        return;
      }
    }
    console.log(filterValues)
    axios
      .post(`${process.env.REACT_APP_API}/searchJobs`, filterValues)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data)
          setJobs(response.data);
          // setJobs([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
        } else {
          alert("Could not retrieve jobs!");
        }
      })
      .catch((error) => {
        alert("Could not retrieve jobs!");
      });
  };

  const fetchCompanies = () => {
    axios
      .get(`${process.env.REACT_APP_API}/getAllCompanies`)
      .then((response) => {
        if (response.status == 200) {
          setCompanies(response.data);
        } else {
          alert("Could not retrieve jobs!");
        }
      })
      .catch((error) => {
        console.log(error)
        alert("Could not retrieve jobs!");
      });
  };

  function handleChange(name, event) {
    console.log(event.target)
    const filterValues = { ...filter };
    filterValues[name] = event.target.value;
    console.log(filterValues)
    setState({ ...state, filter: filterValues });
  }

  function handleSalaryChange(name, event) {
    const filterValues = { ...filter };
    filterValues["salary"][name] = event.target.value;
    setState({ ...state, filter: filterValues });
  }
  useEffect(() => {
    fetchCompanies();
    search();
  }, []);

  const [state, setState] = useState({
    jobOpenings: [],
    filter: {
      companyID: null,
      salary: {
        min: null,
        max: null,
      },
      yearsOfExp: {
        min: 0,
        max: 30,
      },
      location: null,
    },
  });

  const onChangeYears = (data) => {
    const filters = { ...filter };
    filters.yearsOfExp = data;
    setState({ ...state, filter: filters });
  };

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
        <h2 style={{ textAlign: "center" }}>&nbsp;&nbsp;Search for Jobs</h2>
        <div
          style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "2vw" }}

        >
          <hr></hr>
          <Form.Row>
            <Form.Group
              as={Col}
              md="2"
              style={{ marginLeft: "2vw", marginRight: "0.5vw" }}
            >
              <Form.Label>Company</Form.Label>
              <Form.Control size="sm" as="select" onChange={(event) => handleChange("companyID", event)}>
                <option value={null}>Select Company</option>
                {console.log(companies)}
                {companies ? companies.map((c) => {
                  return (
                    < option value={c._id} > { c.companyName}</option>
                  )
                }) : null}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="2" style={{ marginRight: "0.5vw" }}>
              <Form.Label>Location</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter Location"
                value={filter.location}
                onChange={(event) => handleChange("location", event)}
              />
            </Form.Group>
            <Form.Group as={Col} md="3" style={{ marginRight: "1vw" }}>
              <Form.Label>Years of Experience</Form.Label>
              <br></br>
              <Slider
                data={filter ? filter.yearsOfExp : null}
                onChange={onChangeYears}
              />
            </Form.Group>
            <Form.Group as={Col} md="3" style={{ marginRight: "0.5vw" }}>
              <Form.Label>Annual Salary</Form.Label>
              <Form.Row>
                <Form.Group as={Col} md="6">
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">Rs.</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={filter.salary.min}
                      onChange={(event) => handleSalaryChange("min", event)}
                    />
                  </InputGroup>
                  <Form.Text muted>Minimum</Form.Text>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend size="sm">
                      <InputGroup.Text id="basic-addon1">Rs.</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={filter.salary.max}
                      onChange={(event) => handleSalaryChange("max", event)}
                    />
                  </InputGroup>
                  <Form.Text muted>Maximum</Form.Text>
                </Form.Group>
              </Form.Row>
            </Form.Group>
            <Form.Group as={Col} md="1">
              <Button
                style={{ marginTop: "2em", height: "2em" }}
                variant="primary"
                type="submit"
                onClick={() => search()}
              >
                Search
              </Button>{" "}
            </Form.Group>
          </Form.Row>
          <hr style={{ marginTop: "-1vw" }}></hr>
          <div style={{ marginLeft: "3vw" }} >
            <CardGroup className="carddeck" >

              {jobs
                ? currentJobs.map((job, index) => {
                  return (
                    <Row>
                      <Card
                        className="jobCard"
                      >
                        <Card.Body>
                          <Card.Title style={{ color: "#9966cc" }}>
                            {job.companyID.companyName}<br></br>
                          </Card.Title>
                          <Row><GoLocation size={15} style={{ color: " white", marginLeft: "0.7vw" }}></GoLocation><p>&nbsp;&nbsp;{job.location}</p></Row>
                          <hr style={{ marginTop: "-0.5vw" }}></hr>
                          <Card.Text >
                            <h6>{job.jobTitle}</h6>
                          </Card.Text>
                          <div className="centerItems">
                            <Link to={`/Applicant/JobDetails/${job._id}`}><Button className="btn-grad">View Job</Button></Link>
                          </div>
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

export default SearchJob;
