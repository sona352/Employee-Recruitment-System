interface Job {
    companyID: string,
    jobTitle: string,
    jobDesc: string,
    salary: number,
    skillset: string,
    location: string,
    startDate: Date,
    applyBy: Date,
    yearsOfExp: number
}

export default Job;