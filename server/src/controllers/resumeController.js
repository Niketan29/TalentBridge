import Resume from "../models/Resume.js";

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      studentId: req.user._id,
      ...req.body,
    });

    return res.status(201).json({
      message: "Resume created ✅",
      resume,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ studentId: req.user._id }).sort({
      updatedAt: -1,
    });
    return res.json({ resumes });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.json({ resume });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.json({ message: "Resume updated ✅", resume });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.json({ message: "Resume deleted ✅" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const setActiveResume = async (req, res) => {
  try {
    const resumeId = req.params.id;

    await Resume.updateMany(
      { studentId: req.user._id },
      { $set: { isActive: false } }
    );

    const active = await Resume.findOneAndUpdate(
      { _id: resumeId, studentId: req.user._id },
      { $set: { isActive: true } },
      { new: true }
    );

    if (!active) return res.status(404).json({ message: "Resume not found" });

    return res.json({ message: "Active resume set ✅", resume: active });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      studentId: req.user._id,
      isActive: true,
    });

    return res.json({ resume: resume || null });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
