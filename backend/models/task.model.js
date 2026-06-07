import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
})

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    attachments: [
      {
        type: String,
      },
    ],

    todoChecklist: [todoSchema],

    progress: { type: Number, default: 0 },

    comments: [commentSchema],

    timeTracked: {
      type: Number,
      default: 0, // Cumulative minutes tracked on the task
    },

    isTimerRunning: {
      type: Boolean,
      default: false,
    },

    timerStartedAt: {
      type: Date,
    },

    approvalStatus: {
      type: String,
      enum: ["None", "Pending Approval", "Approved", "Rejected"],
      default: "None",
    },
  },
  { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)

export default Task
