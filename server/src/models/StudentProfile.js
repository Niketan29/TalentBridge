import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },

    phone: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },

    skills: [{ type: String }],
    education: [
      {
        degree: String,
        institute: String,
        startYear: String,
        endYear: String,
      },
    ],

    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
