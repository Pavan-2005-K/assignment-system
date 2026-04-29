const express = require("express");
const mongoose = require("mongoose");

// models
const Assignment = require("./models/ass");
const Submission = require("./models/Submission");

const app = express();

// ================= MIDDLEWARE =================

app.use(express.json());

// request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================= DATABASE =================

mongoose.connect("mongodb://127.0.0.1:27017/assignmentDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= ROUTES =================

// test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// ================= ASSIGNMENT APIs =================

// CREATE Assignment
app.post("/assignments", async (req, res) => {
  try {
    const { title, subject, description, dueDate } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        message: "Title, Subject and Due Date are required"
      });
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        message: "Due date must be in the future"
      });
    }

    const assignment = new Assignment({
      title,
      subject,
      description,
      dueDate
    });

    const savedAssignment = await assignment.save();

    res.status(201).json({
      message: "Assignment created",
      data: savedAssignment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all assignments
app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();

    for (let a of assignments) {
      if (new Date() > new Date(a.dueDate) && a.status === "active") {
        a.status = "closed";
        await a.save();
      }
    }

    res.json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= BONUS APIs =================
// ⚠️ These MUST come BEFORE /assignments/:id
// otherwise Express matches "filter"/"sorted" as :id

// FILTER
app.get("/assignments/filter", async (req, res) => {
  try {
    const { status, subject } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = subject;

    const assignments = await Assignment.find(filter);
    res.json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SORT
app.get("/assignments/sorted", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single assignment
app.get("/assignments/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (new Date() > new Date(assignment.dueDate) && assignment.status === "active") {
      assignment.status = "closed";
      await assignment.save();
    }

    res.json(assignment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE assignment
app.put("/assignments/:id", async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE assignment
app.delete("/assignments/:id", async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SUBMISSION APIs =================

// CREATE submission
app.post("/assignments/:id/submissions", async (req, res) => {
  try {
    const { studentName, content } = req.body;
    const assignmentId = req.params.id;

    if (!studentName || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({ message: "Submission deadline passed" });
    }

    if (assignment.status !== "active") {
      return res.status(400).json({ message: "Assignment is closed" });
    }

    const existing = await Submission.findOne({
      assignmentId,
      studentName
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const submission = new Submission({
      studentName,
      content,
      assignmentId
    });

    const savedSubmission = await submission.save();

    res.status(201).json({
      message: "Submission successful",
      data: savedSubmission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET submissions for one assignment
app.get("/assignments/:id/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignmentId: req.params.id
    }).populate("assignmentId");

    res.json({
      count: submissions.length,
      data: submissions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL submissions
app.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().populate("assignmentId");

    res.json({
      count: submissions.length,
      data: submissions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});