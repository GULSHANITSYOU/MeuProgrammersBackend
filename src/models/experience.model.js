import mongoose from "mongoose";

const Schema = mongoose.Schema;
const experienceSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  positionName: {
    type: String,
    required: true,
  },
  organisationName: {
    type: String,
    required: true,
  },
  positionType: {
    type: String,
    required: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  endingDate: {
    type: Date, // Optional by default, but you can clarify this
  },
  isCurrentPosition: {
    // Changed for clarity
    type: Boolean,
    required: true,
  },
  positionDescription: {
    type: String, // Optional by default, so no need to specify it unless you want to
  },
});

export const Experience = mongoose.model("Experience", experienceSchema);
