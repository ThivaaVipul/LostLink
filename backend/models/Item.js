const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['lost', 'found'], required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  imageURL: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: String, required: true },
  uniqueLink: { type: String, required: true, unique: true },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Item", itemSchema);
