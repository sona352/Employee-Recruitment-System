import axios from "axios";
import Cookies from "js-cookie";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Nav from "./ApplicantNav";
const Dashboard = (props) => {
  let history = useHistory();

  const [page, setPage] = useState("");
  const [tab, setTab] = useState("1");
  const [disablesubmit, setDisableSubmit] = useState(false);

  const [state, setState] = useState({
    applicantID: "",
    profileData: {
      firstname: "",
      lastname: "",
      userType: "applicant",
      email: "",
      password: "",
      phone: "",
    },
    applicantData: {
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },
      dob: "",
      percent10: "",
      percent12: "",
      gradDetails: {
        degreeType: "",
        yearPassOut: "",
        cgpa: "",
        university: "",
        country: "",
      },
      resumeLink: "",
      nationality: "",
      locationPref: "",
    },
  });

  const { applicantID, profileData, applicantData } = state;

  const fetchProfile = (userID) => {
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API}/getApplicantProfile/${userID}`),
        axios.get(`${process.env.REACT_APP_API}/getProfile/${userID}`),
      ])
      .then(
        axios.spread((obj1, obj2) => {
          setState({
            ...state,
            profileData: obj2.data,
            applicantData: obj1.data,
            applicantID: userID,
          });
        })
      )
      .catch((error) => { alert("Could not load profile") });
  };
  useEffect(() => {
    var currpage = props.match.params.page;
    setPage(currpage);
    if (currpage === "EditProfile") {
      var userID = Cookies.get("userID");
      fetchProfile(userID);
    }
  }, []);

  const handleProfileDataChange = (name, event) => {
    var profile = { ...profileData };
    profile[name] = event.target.value;
    setState({ ...state, profileData: profile });
  };

  const handleApplicantDataChange = (name, event) => {
    var applicant = { ...applicantData };
    applicant[name] = event.target.value;
    setState({ ...state, applicantData: applicant });
  };

  const handleAddressChange = (name, event) => {
    var applicant = { ...applicantData };
    applicant.address[name] = event.target.value;
    setState({ ...state, applicantData: applicant });
  };

  const handleGradChange = (name, event) => {
    var applicant = { ...applicantData };
    applicant.gradDetails[name] = event.target.value;
    setState({ ...state, applicantData: applicant });
  };

  const updateProfile = (event, Profile) => {
    event.preventDefault();
    var ProfileData;
    if (page === "Signup") {
      ProfileData = Profile;
      ProfileData.profileData.userType = "applicant";
    } else {
      ProfileData = state;
    }
    axios
      .post(`${process.env.REACT_APP_API}/updateApplicantProfile`, ProfileData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (page == "Signup") {
            alert("Registered Successfully");
            history.push("/");
          } else {
            alert("Profile Updated Successfully");
          }
        } else {
          if (page == "Signup") {
            alert("Could not Sign Up! Please try again");
          } else {
            alert("Could not update profile! Please try again");
          }
          window.location.reload();
        }
      })
      .catch((error) => {
        if (page == "Signup") {
          alert("Could not Sign Up! Please try again");
        } else {
          alert("Could not update profile! Please try again");
        }
        window.location.reload();
      });
  };

  const SignUp = (event) => {
    event.preventDefault();
    console.log(profileData, state);
    axios
      .post(`${process.env.REACT_APP_API}/signup`, profileData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          var Profile = state;
          Profile.applicantID = response.data.userID;
          updateProfile(event, Profile);
        } else {
          alert("Could not register! Please try again");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert("Could not register! Please try again");
        window.location.reload();
      });
  };

  const PersonalInfo = (
    <Card.Body
      style={{
        marginTop: "-1.5vw",
        paddingLeft: "10em",
        paddingRight: "10em",
      }}
    >
      <form
        onSubmit={(event) => {
          page === "Signup"
            ? (function () {
              event.preventDefault();
              setTab("2");
            })()
            : updateProfile(event);
        }}
      >
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label className="formlabel">First Name</Form.Label>
            <Form.Control
              value={profileData ? profileData.firstname : null}
              placeholder="Enter First Name"
              onChange={(event) => {
                handleProfileDataChange("firstname", event);
              }}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label className="formlabel">Last Name</Form.Label>
            <Form.Control
              value={profileData ? profileData.lastname : null}
              placeholder="Enter Last Name"
              onChange={(event) => {
                handleProfileDataChange("lastname", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label className="formlabel">Email</Form.Label>
            <Form.Control
              value={profileData ? profileData.email : null}
              placeholder="Enter Email"
              onChange={(event) => {
                handleProfileDataChange("email", event);
              }}
              required
            />
          </Form.Group>
          {page === "Signup" ? (
            <Form.Group as={Col}>
              <Form.Label className="formlabel">Password</Form.Label>
              <Form.Control
                value={profileData ? profileData.password : null}
                type="password"
                placeholder="Enter Password"
                onChange={(event) => {
                  handleProfileDataChange("password", event);
                }}
                required
              />
            </Form.Group>
          ) : null}

          <Form.Group as={Col}>
            <Form.Label className="formlabel">Phone</Form.Label>
            <Form.Control
              value={profileData ? profileData.phone : null}
              placeholder="Enter Phone"
              onChange={(event) => {
                handleProfileDataChange("phone", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className="formlabel">Date of Birth</Form.Label>
            <Form.Control
              value={applicantData ? moment(applicantData.dob).format("YYYY-MM-DD") : null}
              type="date"
              onChange={(event) => {
                handleApplicantDataChange("dob", event);
              }}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">Nationality</Form.Label>
            <Form.Control
              value={applicantData ? applicantData.nationality : null}
              placeholder="Enter Nationality"
              onChange={(event) => {
                handleApplicantDataChange("nationality", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="8" controlId="formGridEmail">
            <Form.Label className="formlabel">Street</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.address
                  ? applicantData.address.street
                  : null
              }
              placeholder="Enter Street"
              onChange={(event) => {
                handleAddressChange("street", event);
              }}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">City</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.address
                  ? applicantData.address.city
                  : null
              }
              placeholder="Enter City"
              onChange={(event) => {
                handleAddressChange("city", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className="formlabel">State</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.address
                  ? applicantData.address.state
                  : null
              }
              placeholder="Enter State"
              onChange={(event) => {
                handleAddressChange("state", event);
              }}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">Pincode</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.address
                  ? applicantData.address.pincode
                  : null
              }
              placeholder="Enter Pincode"
              onChange={(event) => {
                handleAddressChange("pincode", event);
              }}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">Country</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.address
                  ? applicantData.address.country
                  : null
              }
              placeholder="Enter Country"
              onChange={(event) => {
                handleAddressChange("country", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>
        <div className="center">
          {page === "Signup" ? (
            <Button type="submit" variant="primary">
              Next
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
    </Card.Body>
  );

  const EducationInfo = (
    <Card.Body
      style={{
        marginTop: "-1.5vw",
        paddingLeft: "10em",
        paddingRight: "10em",
      }}
    >
      <form
        onSubmit={(event) => {
          page === "Signup"
            ? (function () {
              event.preventDefault();
              setTab("3");
            })()
            : updateProfile(event);
        }}
      >
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className="formlabel">10th Percentage</Form.Label>
            <Form.Control
              value={applicantData ? applicantData.percent10 : null}
              placeholder="Enter 10th Marks"
              onChange={(event) => {
                handleApplicantDataChange("percent10", event);
              }}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">12th Percentage</Form.Label>
            <Form.Control
              value={applicantData ? applicantData.percent12 : null}
              placeholder="Enter 12th Marks"
              onChange={(event) => {
                handleApplicantDataChange("percent12", event);
              }}
              required
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label className="formlabel">Degree Type</Form.Label>
          <Form.Control
            value={
              applicantData && applicantData.gradDetails
                ? applicantData.gradDetails.degreeType
                : null
            }
            onChange={(event) => {
              handleGradChange("degreeType", event);
            }}
            placeholder="Enter Degree Type"
            required
          />
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label className="formlabel">Year of Pass Out</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.gradDetails
                  ? applicantData.gradDetails.yearPassOut
                  : null
              }
              placeholder="Enter Year of Pass Out"
              onChange={(event) => {
                handleGradChange("yearPassOut", event);
              }}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label className="formlabel">CGPA</Form.Label>
            <Form.Control
              value={
                applicantData && applicantData.gradDetails
                  ? applicantData.gradDetails.cgpa
                  : null
              }
              onChange={(event) => {
                handleGradChange("cgpa", event);
              }}
              placeholder="Enter CGPA"
              required
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label className="formlabel">University</Form.Label>
          <Form.Control
            value={
              applicantData && applicantData.gradDetails
                ? applicantData.gradDetails.university
                : null
            }
            placeholder="Enter University"
            onChange={(event) => {
              handleGradChange("university", event);
            }}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="formlabel">Country</Form.Label>
          <Form.Control
            value={
              applicantData && applicantData.gradDetails
                ? applicantData.gradDetails.country
                : null
            }
            placeholder="Enter Country"
            onChange={(event) => {
              handleGradChange("country", event);
            }}
            required
          />
        </Form.Group>
        <div className="center">
          {page === "Signup" ? (
            <>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </>
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </div>
      </form>
    </Card.Body>
  );

  const JobInfo = (
    <Card.Body
      style={{
        marginTop: "-1.5vw",
        paddingLeft: "10em",
        paddingRight: "10em",
      }}
    >
      <form
        onSubmit={(event) => {
          page === "Signup"
            ? (function () {
              event.preventDefault();
              setDisableSubmit(true);
              SignUp(event);
            })()
            : updateProfile(event);
        }}
      >
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label className="formlabel">Preffered Job Location</Form.Label>
          <Form.Control
            value={applicantData ? applicantData.locationPref : null}
            placeholder="Enter preferred location"
            onChange={(event) => {
              handleApplicantDataChange("locationPref", event);
            }}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label className="formlabel">Resume Link</Form.Label>
          <Form.Control
            value={applicantData ? applicantData.resumeLink : null}
            placeholder="Paste the google drive link"
            onChange={(event) => {
              handleApplicantDataChange("resumeLink", event);
            }}
            required
          />
        </Form.Group>
        <div className="center">
          {page === "Signup" ? (
            <>
              <Button variant="primary" type="submit" disabled={disablesubmit}>
                Submit
              </Button>
            </>
          ) : (
            <Button variant="primary" type="submit" disabled={disablesubmit}>
              Submit
            </Button>
          )}
        </div>
      </form>
    </Card.Body>
  );

  return (
    <body style={{ backgroundColor: "#1f1e2e", color: "#f0ece2cc" }}>
      {page === "EditProfile" ? <Nav></Nav> : null}
      <div
        style={{
          marginLeft: page === "EditProfile" ? "10vw" : "14vw",
          marginTop: "2em",
          marginBottom: "3em",
        }}
      >

        <Card
          style={{
            backgroundColor: "f4f9f9",
            height: "44vw",
            width: "72vw",
            borderRadius: "1em",
          }}
        >
          <div
            style={{ marginBottom: "-6em" }}
            className="p-5 d-flex center headingtabs"
          >
            <b>About</b>
            <div style={{ width: "10vw" }}></div>
            <b>Education</b>
            <div style={{ width: "8.5vw" }}></div>
            <b> Job Info</b>
          </div>
          <div
            className="p-5 d-flex center"
          >
            <div
              onClick={() => {
                page === "EditProfile" ? setTab("1") : setTab(tab);
              }}
              className={tab === "1" ? "filledcircle" : "circle"}
            >
              <p style={{ marginTop: "10px" }}>1</p>
            </div>
            <div className="line-btw"></div>
            <div
              onClick={() => {
                page === "EditProfile" ? setTab("2") : setTab(tab);
              }}
              className={tab === "2" ? "filledcircle" : "circle"}
            >
              <p style={{ marginTop: "10px" }}>2</p>
            </div>
            <div className="line-btw"></div>
            <div
              onClick={() => {
                page === "EditProfile" ? setTab("3") : setTab(tab);
              }}
              className={tab == "3" ? "filledcircle" : "circle"}
            >
              <p style={{ marginTop: "10px" }}>3</p>
            </div>
          </div>

          {tab === "1"
            ? [PersonalInfo]
            : tab === "2"
              ? [EducationInfo]
              : [JobInfo]}
        </Card>
      </div>
      <hr></hr>
    </body>
  );
};

export default Dashboard;
