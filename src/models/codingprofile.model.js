import mongoose from "mongoose";

const Schema = mongoose.Schema;
const codingProfileLinks = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  leetcode: {
    type: String,
  },
  geeksForGeeks: {
    type: String,
  },
  codeChef: {
    type: String,
  },
  codeForces: {
    type: String,
  },
  atCoder: {
    type: String,
  },
  hackerRank: {
    type: String,
  },
  hackerEarth: {
    type: String,
  },
  interviewBit: {
    type: String,
  },
});

export const CodingProfile = mongoose.model(
  "CodingProfile",
  codingProfileLinks
);
