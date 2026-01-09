const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortCode: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    userId: { type: String, required: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Url", urlSchema);
