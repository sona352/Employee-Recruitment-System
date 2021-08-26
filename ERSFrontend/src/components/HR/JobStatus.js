import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Nav from "./hrnav";

const JobStatus = (props) => {
	const [applStatus, setapplStatus] = useState({
		jobStatus: "",
		interviewStatus: "",
		feedback: "",
	})

	const fetchStatus = () => {
		axios.get(`${process.env.REACT_APP_API}/getApplicationStatus/${props.match.params.id1}/${props.match.params.id2}`)
			.then((response) => {
				if (response.status == 200) {
					console.log("response data: ", response.data);
					//   setState({...state,applData:response.data});
					let feedback = "";
					if (response.data.interviewID)
						feedback = response.data.interviewID.feedback;
					setapplStatus({
						jobStatus: response.data.jobStatus,
						interviewStatus: response.data.interviewStatus,
						feedback
					})
				}
				else {
					alert("Could not retrieve Status!");
				}
			})

			.catch((error) => { console.log(error); alert("Could not load Status") });

	}
	useEffect(() => {
		fetchStatus();
	}, []);

	const handleStatusDataChange = (name, event) => {
		setapplStatus({ ...applStatus, [name]: event.target.value });
	}

	const updateStatus = (event) => {
		event.preventDefault();
		console.log(applStatus);
		axios.post(`${process.env.REACT_APP_API}/updateApplicationStatus/`, {
			jobID: props.match.params.id2,
			applicantID: props.match.params.id1,
			jobStatus: applStatus.jobStatus,
			interviewStatus: applStatus.interviewStatus
		})
			.then((response) => {
				if (response.status == 200) {
					alert("Updated Status!");
					window.location.reload();
				}
				else {
					alert("Could not update status!");
				}
			})
			.catch((error) => { console.log(error); alert("Could update status!") });
	}

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
				<h2 style={{ textAlign: "center" }}>&nbsp;&nbsp;Job Status</h2>
				<br></br>
				<div
					// style={{ marginLeft: "10vw", marginRight: "3vw", marginTop: "1vw" }}
					style={{
						// marginLeft: page === "AddJob" ? "9vw" : "9vw",
						marginTop: "11em",
						marginLeft: "35em",
						marginBottom: "3em",
					}}
				>
					<Row>
						<Card className="jobCard">
							<Card.Body>
								<form>
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label className="formlabel">Job Status</Form.Label>
											<Form.Control
												value={applStatus.jobStatus}
												placeholder="Enter Job Status"
												onChange={(event) => {
													handleStatusDataChange("jobStatus", event);
												}}
												required
											/>
										</Form.Group>
									</Form.Row>
									<Form.Row>
										<Form.Group as={Col}>
											<Form.Label className="formlabel">Interview Status</Form.Label>
											<Form.Control
												value={applStatus.interviewStatus}
												placeholder="Enter Interview Status"
												onChange={(event) => {
													handleStatusDataChange("interviewStatus", event);
												}}
												required
											/>
										</Form.Group>
									</Form.Row>
									Feedback (if completed): <br />
									<div style={{ color: "white" }}>
										{applStatus.feedback}
									</div> <br />
									<Button variant="primary" type="submit" onClick={(event) => updateStatus(event)}>
										Update Status
									</Button>
								</form>
							</Card.Body>
						</Card>
					</Row>
				</div>
			</div>
		</body>

	);

};
export default JobStatus;