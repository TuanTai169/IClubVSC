const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//Route
const authRouter = require("./routes/auth");
const memberRouter = require("./routes/member");
const activityRouter = require("./routes/activity");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fristappmearn.jwhoj.mongodb.net/IClubVSC?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/member", memberRouter);
app.use("/api/activity", activityRouter);

const POST = 5000;

app.listen(POST, () => console.log(`Server started on post ${POST}`));
