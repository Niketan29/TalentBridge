import StudentProfile from "../models/StudentProfile.js";

export const getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    return res.json({
      profile: profile || null,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const upsertStudentProfile = async (req, res) => {
  try {
    const data = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { ...data, userId: req.user._id } },
      { new: true, upsert: true }
    );

    return res.json({ message: "Student profile saved ✅", profile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
