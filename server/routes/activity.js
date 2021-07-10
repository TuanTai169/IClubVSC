const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Activity = require("../models/Activity");

// @route GET api/activity/list
// @decs Read activity
// @access Private
router.get("/list", async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.json({ success: true, activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route POST api/activity/add
// @decs Create Activity
// @access Private
router.post("/add", verifyToken, async (req, res) => {
  const { actName, actDate, actAddress, content, cost, image, status } =
    req.body;

  //Simple validation
  if (!actName)
    return res
      .status(400)
      .json({ success: false, message: "ActName is required" });

  try {
    const newActivity = new Activity({
      actName,
      actDate,
      actAddress,
      content,
      cost,
      image,
      status: status || "HAPPENED",
      user: req.userId,
    });
    await newActivity.save();

    res.json({
      success: true,
      message: "Activity created successfully",
      member: newActivity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route PUT api/activity/update
// @decs UPDATE Activity
// @access Private
router.put("/update/:id", verifyToken, async (req, res) => {
  const { actName, actDate, actAddress, content, cost, image, status } =
    req.body;

  //Simple validation
  if (!actName)
    return res
      .status(400)
      .json({ success: false, message: "ActName is required" });

  try {
    let updatedActivity = {
      actName,
      actDate,
      actAddress,
      content: content || "",
      cost: cost || "",
      image: image || "",
      status: status || "HAPPENED",
    };

    const activityUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedActivity = await Activity.findOneAndUpdate(
      activityUpdateCondition,
      updatedActivity,
      { new: true }
    );

    //Activity not authorized to updated activity
    if (!updatedActivity)
      return res
        .status(401)
        .json({ access: false, message: "Activity not found" });

    res.json({
      success: true,
      message: "Activity is updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// @route DELETED api/activity/delete
// @decs DELETE activity
// @access Private
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const activityDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedActivity = await Activity.findOneAndDelete(
      activityDeleteCondition
    );

    //Activity not authorized to delete activity
    if (!deletedActivity)
      return res
        .status(401)
        .json({ access: false, message: "Activity not found" });

    res.json({
      success: true,
      message: "Activity is deleted successfully",
      activity: deletedActivity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
