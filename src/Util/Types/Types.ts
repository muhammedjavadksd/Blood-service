import mongoose from "mongoose";
import { BloodGroup } from "./Enum";

type mongoObjectId = mongoose.Types.ObjectId;
type IBloodAvailabilityResult = Record<BloodGroup, number>

type LocatedAt = {
    hospital_name: string,
    hospital_id: string,
    coordinates: [number, number]
}

export { mongoObjectId, IBloodAvailabilityResult, LocatedAt }