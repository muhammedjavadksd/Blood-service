"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FolderName = exports.ChatFrom = exports.DonorAccountBlockedReason = exports.BloodDonationStatus = exports.BloodDonorStatus = exports.BloodGroupFilter = exports.BloodGroupUpdateStatus = exports.StatusCode = exports.Relationship = exports.BloodStatus = exports.JwtTimer = exports.S3BucketsNames = exports.BloodGroup = exports.BloodCloseCategory = void 0;
var BloodGroup;
(function (BloodGroup) {
    BloodGroup["A_POSITIVE"] = "A+";
    BloodGroup["A_NEGATIVE"] = "A-";
    BloodGroup["B_POSITIVE"] = "B+";
    BloodGroup["B_NEGATIVE"] = "B-";
    BloodGroup["AB_POSITIVE"] = "AB+";
    BloodGroup["AB_NEGATIVE"] = "AB-";
    BloodGroup["O_POSITIVE"] = "O+";
    BloodGroup["O_NEGATIVE"] = "O-";
})(BloodGroup || (exports.BloodGroup = BloodGroup = {}));
var JwtTimer;
(function (JwtTimer) {
    JwtTimer["_30Days"] = "30d";
    JwtTimer["_1Year"] = "1year";
})(JwtTimer || (exports.JwtTimer = JwtTimer = {}));
var BloodGroupFilter;
(function (BloodGroupFilter) {
    BloodGroupFilter["All"] = "all";
    BloodGroupFilter["A_POSITIVE"] = "A+";
    BloodGroupFilter["A_NEGATIVE"] = "A-";
    BloodGroupFilter["B_POSITIVE"] = "B+";
    BloodGroupFilter["B_NEGATIVE"] = "B-";
    BloodGroupFilter["AB_POSITIVE"] = "AB+";
    BloodGroupFilter["AB_NEGATIVE"] = "AB-";
    BloodGroupFilter["O_POSITIVE"] = "O+";
    BloodGroupFilter["O_NEGATIVE"] = "O-";
})(BloodGroupFilter || (exports.BloodGroupFilter = BloodGroupFilter = {}));
var BloodDonorStatus;
(function (BloodDonorStatus) {
    BloodDonorStatus["Open"] = "Open";
    BloodDonorStatus["Blocked"] = "Blocked";
    BloodDonorStatus["Deleted"] = "Deleted";
})(BloodDonorStatus || (exports.BloodDonorStatus = BloodDonorStatus = {}));
var BloodCloseCategory;
(function (BloodCloseCategory) {
    BloodCloseCategory["AdminClose"] = "Admin close request";
    BloodCloseCategory["FULFILLED"] = "Fulfilled the request";
    BloodCloseCategory["MEDICAL_CONDITION_CHANGE"] = "Medical Condition Change";
    BloodCloseCategory["ERROR_IN_REQUEST"] = "Error in Request";
    BloodCloseCategory["POSTPONED"] = "Postponed";
    BloodCloseCategory["UNABLE_TO_ARRANGE_DONORS"] = "Unable to Arrange Donors";
    BloodCloseCategory["CHANGE_IN_TREATMENT_PLAN"] = "Change in Treatment Plan";
})(BloodCloseCategory || (exports.BloodCloseCategory = BloodCloseCategory = {}));
var BloodStatus;
(function (BloodStatus) {
    BloodStatus["Pending"] = "pending";
    BloodStatus["Closed"] = "closed";
    BloodStatus["Approved"] = "approved";
})(BloodStatus || (exports.BloodStatus = BloodStatus = {}));
var Relationship;
(function (Relationship) {
    Relationship["MYSELF"] = "Myself";
    Relationship["FATHER"] = "Father";
    Relationship["MOTHER"] = "Mother";
    Relationship["BROTHER"] = "Brother";
    Relationship["SISTER"] = "Sister";
    Relationship["CHILD"] = "Child";
    Relationship["FRIEND"] = "Friend";
    Relationship["NEIGHBOR"] = "Neighbor";
    Relationship["COWORKER"] = "Co-worker";
    Relationship["RELATIVE"] = "Relative";
    Relationship["GRANDFATHER"] = "Grandfather";
    Relationship["GRANDMOTHER"] = "Grandmother";
    Relationship["UNCLE"] = "Uncle";
    Relationship["AUNT"] = "Aunt";
    Relationship["NIECE"] = "Niece";
    Relationship["NEPHEW"] = "Nephew";
    Relationship["COUSIN"] = "Cousin";
    Relationship["PARTNER"] = "Partner";
    Relationship["SPOUSE"] = "Spouse";
    Relationship["INLAW"] = "In-law";
})(Relationship || (exports.Relationship = Relationship = {}));
var DonorAccountBlockedReason;
(function (DonorAccountBlockedReason) {
    DonorAccountBlockedReason["AlreadyDonated"] = "You have already donated within the last 90 days. Please wait until 90 days have passed since your last donation before donating again.";
    DonorAccountBlockedReason["UserHideAccount"] = "Your profile has been temporarily hidden from donation listings.";
    DonorAccountBlockedReason["AccountDeleted"] = "It seems like your account has been deleted";
    DonorAccountBlockedReason["AccountJustCreated"] = "Admin just created the account, need verification";
})(DonorAccountBlockedReason || (exports.DonorAccountBlockedReason = DonorAccountBlockedReason = {}));
var S3FolderName;
(function (S3FolderName) {
    S3FolderName["bloodCertification"] = "blood-certification";
})(S3FolderName || (exports.S3FolderName = S3FolderName = {}));
var BloodDonationStatus;
(function (BloodDonationStatus) {
    BloodDonationStatus["Approved"] = "Approved";
    BloodDonationStatus["Rejected"] = "Rejected";
    BloodDonationStatus["Pending"] = "Pending";
    BloodDonationStatus["NotResponded"] = "not-responded";
})(BloodDonationStatus || (exports.BloodDonationStatus = BloodDonationStatus = {}));
var BloodGroupUpdateStatus;
(function (BloodGroupUpdateStatus) {
    BloodGroupUpdateStatus["Pending"] = "pending";
    BloodGroupUpdateStatus["Completed"] = "completed";
    BloodGroupUpdateStatus["Rejected"] = "rejected";
})(BloodGroupUpdateStatus || (exports.BloodGroupUpdateStatus = BloodGroupUpdateStatus = {}));
var S3BucketsNames;
(function (S3BucketsNames) {
    S3BucketsNames["bloodCertificate"] = "lifelink-blood-bank";
})(S3BucketsNames || (exports.S3BucketsNames = S3BucketsNames = {}));
var ChatFrom;
(function (ChatFrom) {
    ChatFrom["Donor"] = "Donor";
    ChatFrom["Patient"] = "Patient";
})(ChatFrom || (exports.ChatFrom = ChatFrom = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
