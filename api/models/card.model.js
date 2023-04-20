const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    project: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },

    // some other properties, that are not part of task, but may be part of task management system.
    // status, assignedBy, assignedTo, dueDate, ...
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("card", cardSchema);
