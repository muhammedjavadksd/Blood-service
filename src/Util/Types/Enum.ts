enum BloodGroup {
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-"
}


enum JwtTimer {
    _30Days = "30d"
}


enum BloodGroupFilter {
    All = "all",
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-"
}


enum BloodDonorStatus {
    Open = "Open",
    Blocked = "Blocked",
    Deleted = "Deleted"
}

enum BloodCloseCategory {
    FULFILLED = "Fulfilled the request",
    MEDICAL_CONDITION_CHANGE = "Medical Condition Change",
    ERROR_IN_REQUEST = "Error in Request",
    POSTPONED = "Postponed",
    UNABLE_TO_ARRANGE_DONORS = "Unable to Arrange Donors",
    CHANGE_IN_TREATMENT_PLAN = "Change in Treatment Plan"
}

enum BloodStatus {
    Pending = 'pending',
    Closed = "closed",
    Approved = "approved",
}

enum Relationship {
    MYSELF = "Myself",
    FATHER = "Father",
    MOTHER = "Mother",
    BROTHER = "Brother",
    SISTER = "Sister",
    CHILD = "Child",
    FRIEND = "Friend",
    NEIGHBOR = "Neighbor",
    COWORKER = "Co-worker",
    RELATIVE = "Relative",
    GRANDFATHER = "Grandfather",
    GRANDMOTHER = "Grandmother",
    UNCLE = "Uncle",
    AUNT = "Aunt",
    NIECE = "Niece",
    NEPHEW = "Nephew",
    COUSIN = "Cousin",
    PARTNER = "Partner",
    SPOUSE = "Spouse",
    INLAW = "In-law"
}


enum DonorAccountBlockedReason {
    AlreadyDonated = "You have already donated within the last 90 days. Please wait until 90 days have passed since your last donation before donating again.",
    UserHideAccount = "Your profile has been temporarily hidden from donation listings.",
    AccountDeleted = "It seems like your account has been deleted"
}

enum S3FolderName {
    bloodCertification = "blood-certification"
}

enum BloodDonationStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending",
    NotResponded = "not-responded",
}

enum BloodGroupUpdateStatus {
    Pending = "pending",
    Completed = "completed",
    Rejected = "rejected"
}

enum S3BucketsNames {
    bloodCertificate = "blood-certificate"
}

enum ChatFrom {
    Donor = "Donor",
    Patient = "Patient"
}


enum StatusCode {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICT = 409,
}

export { BloodCloseCategory, BloodGroup, S3BucketsNames, JwtTimer, BloodStatus, Relationship, StatusCode, BloodGroupUpdateStatus, BloodGroupFilter, BloodDonorStatus, BloodDonationStatus, DonorAccountBlockedReason, ChatFrom, S3FolderName }