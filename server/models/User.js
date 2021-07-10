const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  studentCode: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", UserSchema);
