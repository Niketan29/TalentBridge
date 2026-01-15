import RecruiterProfile from "../models/RecruiterProfile.js";

export const getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });

    return res.json({
      profile: profile || null,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const upsertRecruiterProfile = async (req, res) => {
  try {
    const data = req.body;

    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { ...data, userId: req.user._id } },
      { new: true, upsert: true }
    );

    return res.json({ message: "Recruiter profile saved ✅", profile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
