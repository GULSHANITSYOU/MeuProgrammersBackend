import mongoose, { Schema } from "mongoose";

const resourceSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  sem: {
    type: Number,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
    enum: ["Notes", "PYQ's"],
  },
  resourceLink: {
    type: String,
    required: true,
  },
});

export const Resource = mongoose.model("Resource", resourceSchema);
