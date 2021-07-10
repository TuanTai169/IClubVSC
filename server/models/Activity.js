const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  actName: {
    type: String,
    required: true,
  },
  actDate: {
    type: Date,
    required: true,
  },
  actAddress: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  cost: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["HAPPENED", "UPCOMING"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("activities", ActivitySchema);
