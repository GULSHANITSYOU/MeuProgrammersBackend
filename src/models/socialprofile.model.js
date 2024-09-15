import mongoose from "mongoose";

const Schema = mongoose.Schema;
const socialProfileLinks = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  twitterX: {
    type: String,
  },
  instagram: {
    type: String,
  },
});
export const SocialProfile = mongoose.model(
  "SocialProfile",
  socialProfileLinks
);
