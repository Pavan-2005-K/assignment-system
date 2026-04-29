const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"]
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active"
  }
}, {
  timestamps: true
});

// ✅ REPLACE WITH THIS
assignmentSchema.pre("save", function () {
  if (this.isNew && this.dueDate < new Date()) {
    throw new Error("Due date must be in the future");
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema);