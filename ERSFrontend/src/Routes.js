import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ApplicantDashboard from './components/Applicant/applicantDashboard';
import ApplicantLogin from './components/Applicant/applicantlogin';
import ApplicantProfile from './components/Applicant/ApplicantProfile';
import ApplyJob from './components/Applicant/ApplyJob';
import SearchJob from './components/Applicant/SearchJobs';
import ApplViewApplications from './components/Applicant/ViewApplications';
import CompanyLogin from './components/CompanyLogin';
import AddJob from './components/HR/AddJob';
import ApplicantDetails from './components/HR/ApplicantDetails';
import EditJob from './components/HR/EditJob';
import hrDashboard from './components/HR/hrDashboard';
import JobApplications from './components/HR/JobApplications';
import JobDetails from './components/HR/JobDetails';
import JobStatus from './components/HR/JobStatus';
import ScheduleIntr from './components/HR/ScheduleIntr';
import ViewApplications from './components/HR/ViewApplications';
import InterviewDetails from './components/Interviewer/InterviewDetails';
import InterviewerDashboard from './components/Interviewer/InterviewerDashboard';

const Routes = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ApplicantLogin} />
        <Route path="/login" exact component={CompanyLogin} />

        {/* Applicant */}
        <Route path="/ApplicantDashboard" exact component={ApplicantDashboard} />
        <Route path="/ApplicantProfile/:page" exact component={ApplicantProfile} />
        <Route path="/SearchJob" exact component={SearchJob} />
        <Route path="/Applicant/ViewApplications" exact component={ApplViewApplications} />
        <Route path="/Applicant/JobDetails/:id" exact component={ApplyJob} />

        {/* Interviewer */}
        <Route path="/InterviewerDashboard" exact component={InterviewerDashboard} />
        <Route path="/InterviewDetails/:id" exact component={InterviewDetails} />

        {/* HR */}
        <Route path="/hrDashboard" exact component={hrDashboard} />
        <Route path="/AddJob" exact component={AddJob} />
        <Route path="/EditJob" exact component={EditJob} />
        <Route path="/JobDetails/:id" exact component={JobDetails} />
        <Route path="/ViewApplications" exact component={ViewApplications} />
        <Route path="/JobApplications/:id" exact component={JobApplications} />
        <Route path="/ApplicantDetails/:id1/:id2" exact component={ApplicantDetails} />
        <Route path="/ScheduleIntr/:id1/:id2" exact component={ScheduleIntr} />
        <Route path="/JobStatus/:id1/:id2" exact component={JobStatus} />

      </Switch>
    </BrowserRouter>
  )
}

export default Routes;