const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

boardSchema.virtual("cards", {
  ref: "card",
  localField: "_id",
  foreignField: "board",
});
module.exports = mongoose.model("board", boardSchema);
