import mongoose from "mongoose";
const Schema = mongoose.Schema;
const clubSchema = new Schema({
  clubName: {
    type: String,
    required: true,
    unique: true,
  },
  clubTitle: {
    type: String,
    required: true,
    unique: true,
  },
  clubDescription: {
    type: String,
    required: true,
  },
  clubLogo: {
    type: String,
    required: true,
  },
  clubPoster: {
    type: String,
  },
  clubVideos: [
    {
      type: String,
    },
  ],
  clubImages: [
    {
      type: String,
    },
  ],
  clubPresidentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  clubMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  teamMembersCore: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  clubMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});
export const Club = mongoose.model("Club", clubSchema);
