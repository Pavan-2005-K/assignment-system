const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, "Student name is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: [true, "Assignment ID is required"]
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate submissions 
submissionSchema.index({ studentName: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);