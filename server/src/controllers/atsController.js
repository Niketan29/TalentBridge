import Resume from "../models/Resume.js";

// very simple tokenizer (ATS-friendly)
const tokenize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
};

// remove useless words
const stopWords = new Set([
  "the","and","or","a","an","to","in","of","for","with","on","at","by",
  "is","are","was","were","be","been","this","that","from","as","it","we",
  "you","your","our","their","they","will","can","should"
]);

const normalizeKeywords = (words) => {
  const freq = new Map();
  for (const w of words) {
    if (w.length < 2) continue;
    if (stopWords.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  // return sorted high frequency words
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
};

const buildResumeText = (resume) => {
  const p = resume.personal || {};

  const parts = [
    p.fullName,
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.github,
    p.portfolio,
    resume.summary,
    (resume.skills || []).join(" "),
    ...(resume.education || []).map((e) => `${e.degree} ${e.institute}`),
    ...(resume.projects || []).map(
      (pr) => `${pr.title} ${pr.description} ${(pr.techStack || []).join(" ")} ${pr.link}`
    ),
    ...(resume.experience || []).map(
      (ex) => `${ex.role} ${ex.company} ${ex.description}`
    ),
  ];

  return parts.filter(Boolean).join(" ");
};

export const analyzeATS = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message: "resumeId and jobDescription are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      studentId: req.user._id,
    });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const jdTokens = tokenize(jobDescription);
    const resumeTokens = tokenize(buildResumeText(resume));

    const jdKeywords = normalizeKeywords(jdTokens).slice(0, 40); // top 40 keywords
    const resumeSet = new Set(resumeTokens);

    const matched = jdKeywords.filter((k) => resumeSet.has(k));
    const missing = jdKeywords.filter((k) => !resumeSet.has(k));

    const score = jdKeywords.length
      ? Math.round((matched.length / jdKeywords.length) * 100)
      : 0;

    const suggestions = [];
    if (score < 50) suggestions.push("Add more relevant keywords from Job Description.");
    if (!resume.summary || resume.summary.trim().length < 30)
      suggestions.push("Write a strong Summary section (2-3 lines).");
    if (!resume.skills || resume.skills.length === 0)
      suggestions.push("Add Skills section with tools/frameworks from JD.");

    return res.json({
      score,
      matchedKeywords: matched,
      missingKeywords: missing,
      suggestions,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
