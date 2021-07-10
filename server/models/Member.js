const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  studentCode: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  faculty: {
    type: String,
  },
  specialty: {
    type: String,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
    maxLength: 10,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN", "INTERNSHIP"],
  },
  evaluate: {
    type: String,
    required: true,
    enum: ["NOT RATED", "EXCELLENT", "GOOD", "MIDDLING"],
  },
  comment: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("members", MemberSchema);
