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

enum BloodStatus {
    Pending = 'pending',
    Cancelled = "cancelled",
    Completed = "completed"
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


enum BloodDonationStatus {
    Approved = "approved",
    Rejected = "Rejected"
}

enum BloodGroupUpdateStatus {
    Pending = "pending",
    Completed = "completed",
    Rejected = "Rejected"
}

enum S3BucketsNames {
    bloodCertificate = "blood-certificate"
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

export { BloodGroup, S3BucketsNames, JwtTimer, BloodStatus, Relationship, StatusCode, BloodGroupUpdateStatus, BloodGroupFilter, BloodDonorStatus, BloodDonationStatus }