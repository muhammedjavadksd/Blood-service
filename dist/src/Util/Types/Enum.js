"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodGroupUpdateStatus = exports.StatusCode = exports.LocatedAt = exports.Relationship = exports.BloodStatus = exports.BloodGroup = void 0;
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
var BloodStatus;
(function (BloodStatus) {
    BloodStatus["Pending"] = "pending";
    BloodStatus["Cancelled"] = "cancelled";
    BloodStatus["Completed"] = "completed";
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
var LocatedAt;
(function (LocatedAt) {
    LocatedAt["Hospital"] = "Hospital";
    LocatedAt["House"] = "House";
    LocatedAt["Other"] = "Other";
})(LocatedAt || (exports.LocatedAt = LocatedAt = {}));
var BloodGroupUpdateStatus;
(function (BloodGroupUpdateStatus) {
    BloodGroupUpdateStatus["Pending"] = "pending";
    BloodGroupUpdateStatus["Completed"] = "completed";
    BloodGroupUpdateStatus["Rejected"] = "Rejected";
})(BloodGroupUpdateStatus || (exports.BloodGroupUpdateStatus = BloodGroupUpdateStatus = {}));
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
