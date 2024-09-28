import mongoose from "mongoose";

const Schema = mongoose.Schema;
const projectSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  projecctTitle: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
  },
  projectVisitUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  media: [
    {
      type: String,
    },
  ],
});
export const Project = mongoose.model("Project", projectSchema);
