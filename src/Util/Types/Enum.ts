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

enum LocatedAt {
    Hospital = "Hospital",
    House = "House",
    Other = "Other"
}


enum StatusCode {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    BAD_REQUESR = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICT = 409,
}

export { BloodGroup, BloodStatus, Relationship, LocatedAt, StatusCode }