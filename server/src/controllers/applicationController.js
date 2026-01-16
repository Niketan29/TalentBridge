import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const app = await Application.create({
      jobId,
      studentId: req.user._id,
      recruiterId: job.recruiterId,
      status: "applied",
    });

    await Notification.create({
      userId: job.recruiterId,
      title: "New Job Application",
      message: `A student applied to your job: ${job.title}`,
      type: "application",
    });


    return res.status(201).json({ message: "Applied ✅", application: app });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already applied to this job" });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("jobId");

    return res.json({ applications: apps });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const apps = await Application.find({ jobId })
      .sort({ createdAt: -1 })
      .populate("studentId", "name email role");

    return res.json({ applicants: apps });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;

    const allowed = ["applied", "shortlisted", "rejected", "hired"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (app.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    app.status = status;
    await app.save();
    await Notification.create({
      userId: app.studentId,
      title: "Application Status Updated",
      message: `Your application status changed to: ${status}`,
      type: "status",
    });


    return res.json({ message: "Status updated ✅", application: app });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiterId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("studentId", "name email")
      .populate("jobId", "title companyName location")
      .sort({ createdAt: -1 });

    return res.json({ applications });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};