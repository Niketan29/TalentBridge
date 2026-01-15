import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "My Resume" },
    isActive: { type: Boolean, default: false },

    personal: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    summary: { type: String, default: "" },

    skills: [{ type: String }],

    education: [
      {
        degree: String,
        institute: String,
        startYear: String,
        endYear: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],

    experience: [
      {
        role: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
