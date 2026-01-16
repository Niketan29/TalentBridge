import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      skillsRequired,
      description,
    } = req.body;

    if (!title || !companyName || !description) {
      return res.status(400).json({
        message: "title, companyName, description are required",
      });
    }

    const job = await Job.create({
      recruiterId: req.user._id,
      title,
      companyName,
      location: location || "",
      jobType: jobType || "full-time",
      experienceLevel: experienceLevel || "fresher",
      salaryRange: salaryRange || "",
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      description,
    });

    return res.status(201).json({
      message: "Job created ✅",
      job,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { q, location, jobType, experienceLevel, status } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(q, "i")] } },
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("recruiterId", "name email role");

    return res.json({ jobs });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ jobs });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name email"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ job });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    return res.json({ message: "Job updated ✅", job: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.json({ message: "Job deleted ✅" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
