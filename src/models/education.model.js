import mongoose from "mongoose";
const Schema = mongoose.Schema;
const educationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);
