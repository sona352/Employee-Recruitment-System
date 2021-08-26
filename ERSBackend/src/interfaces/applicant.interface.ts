interface Address {
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string
}

interface GradDetails {
    degreeType: string,
    yearPassOut: number,
    cgpa: number,
    university: string,
    country: string
}

interface ApplicantProfile {
    applicantID: string,
    address: Address,
    dob: Date,
    percent10: number,
    percent12: number,
    gradDetails: GradDetails,
    resumeLink: string,
    nationality: string,
    locationPref: string
}

export default ApplicantProfile;