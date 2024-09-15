import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the schema
const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    studentId: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    education: {
      type: Schema.Types.ObjectId,
      ref: "Education",
    },
    skills: [{ type: String }],
    socialLinksId: {
      type: Schema.Types.ObjectId,
      ref: "SocialLinks",
    },
    codingProfilesId: {
      type: Schema.Types.ObjectId,
      ref: "CodingProfiles",
    },
    projectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    experienceIds: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
    profileImage: {
      type: String, // Cloudinary link
    },
    about: {
      type: String,
    },
    headingLine: {
      type: String,
    },
    clubIds: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    resourcesIds: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the password is correct
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      studentId: this.studentId,
      email: this.email,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Method to generate refresh token
studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Export the model
export const Student = mongoose.model("Student", studentSchema);
