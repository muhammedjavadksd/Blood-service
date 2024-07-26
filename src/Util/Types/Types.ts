import mongoose from "mongoose";
import { BloodGroup } from "./Enum";

type mongoObjectId = mongoose.Types.ObjectId;
type IBloodAvailabilityResult = Record<BloodGroup, number>

export { mongoObjectId, IBloodAvailabilityResult }