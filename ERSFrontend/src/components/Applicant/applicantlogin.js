import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import "../../assets/styles/Login.css";


const Login = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "100vh",
    },
    image: {
      backgroundImage:
        "url(https://images.pexels.com/photos/2281772/pexels-photo-2281772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
      backgroundRepeat: "no-repeat",
      backgroundColor:
        theme.palette.type === "light"
          ? theme.palette.grey[50]
          : theme.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    maintextbox: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    maintext: {
      color: "white",
      width: "100px",
      flexGrow: 1,
      padding: "130px",
      fontSize: "16px",
    },
    mainheading: {
      fontSize: "4.5em",
      fontFamily: "'Montserrat', sans-serif",
      color: "white",
      lineHeight: "1.3",
    },
    subtext: {
      paddingTop: "20px",
      fontSize: "1.6em",
      width: "60%",
      fontFamily: "'Lato', sans-serif",
      color: "white",
    },
    button: {
      marginTop: "30px",
      padding: "11px",
      fontSize: "0.9em",
      textAlign: "center",
      backgroundColor: "#1e78e1",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      letterSpacing: "0.1em",
      width: "18%",
    },
  }));

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = state;
  const [loginSpinner, setSpinner] = useState(true);

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value }); //spread operator
  };

  const handleSubmit = (event) => {
    setSpinner(false);
    event.preventDefault();
    var userType = "applicant";
    axios
      .post(`${process.env.REACT_APP_API}/login`, state)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          Cookies.set("userID", response.data.userID);
          Cookies.set("firstname", response.data.firstname);
          Cookies.set("lastname", response.data.lastname);
          props.history.push({
            pathname: `/ApplicantDashboard`,
          });
        } else {
          alert("Invalid Credentials!");
          setSpinner(true);
          setState({ ...state, Password: "" });
        }
      })
      .catch((error) => {
        console.log(error);
        setSpinner(true);
        alert("Could not login!");
      });
  };
  const classes = useStyles();

  return (
    <body style={{ backgroundColor: "#FFFFFF" }}>
      <CssBaseline />
      <Grid item xs={false} sm={9} md={9} className={classes.image}>
        <div className={classes.maintextbox}>
          <div className={classes.maintext}>
            <div className={classes.mainheading}>
              <span>Job Search.</span> <br />
              <span>Simplified</span>.
            </div>
            <div className={classes.subtext}>
              Delivering fast, efficient job search across various domains.
              Fully powered by the web.
            </div>
            <div className={classes.subtext}>Free forever.</div>
            <div className={classes.button}>GET STARTED</div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={3} md={3} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={handleChange("email")}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange("password")}
              value={password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Spinner
              style={{ marginLeft: "2em", color: "black" }}
              hidden={loginSpinner}
              animation="border"
            />
            <Grid container>
              <Grid item xs>
                Don't have an account?{" "}
                <Link
                  to={{
                    pathname: "/ApplicantProfile/Signup",
                    page: "Signup",
                  }}
                >
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </body>
  );
};

export default Login;
