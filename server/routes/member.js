const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Member = require("../models/Member");

// @route GET api/member/list
// @decs Read member
// @access Private
router.get("/list", async (req, res) => {
  try {
    const members = await Member.find({});
    res.json({ success: true, members });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route POST api/member/add
// @decs Create member
// @access Private
router.post("/add", verifyToken, async (req, res) => {
  const {
    studentCode,
    firstName,
    lastName,
    dateOfBirth,
    faculty,
    specialty,
    image,
    phone,
    email,
    role,
    evaluate,
    comment,
  } = req.body;

  //Simple validation
  if (!studentCode)
    return res
      .status(400)
      .json({ success: false, message: "Student Code is required" });

  try {
    const newMember = new Member({
      studentCode,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth || "",
      faculty: faculty || "",
      specialty: specialty || "",
      image: image || "",
      phone: phone || "",
      email: email || "",
      evaluate: evaluate || "NOT RATED",
      comment: comment || "",
      role: role || "INTERNSHIP",
      user: req.userId,
    });
    await newMember.save();

    res.json({
      success: true,
      message: "Member created successfully",
      member: newMember,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route POST api/member/update
// @decs UPDATE member
// @access Private
router.put("/update/:id", verifyToken, async (req, res) => {
  const {
    studentCode,
    firstName,
    lastName,
    dateOfBirth,
    faculty,
    specialty,
    image,
    phone,
    email,
    role,
    evaluate,
    comment,
  } = req.body;

  //Simple validation
  if (!studentCode)
    return res
      .status(400)
      .json({ success: false, message: "Student Code is required" });

  try {
    let updatedMember = {
      studentCode,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth || "",
      faculty: faculty || "",
      specialty: specialty || "",
      image: image || "",
      phone: phone || "",
      email: email || "",
      role: role || "INTERNSHIP",
      evaluate: evaluate || "NOT RATED",
      comment: comment || "",
    };

    const memberUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedMember = await Member.findOneAndUpdate(
      memberUpdateCondition,
      updatedMember,
      { new: true }
    );

    //Member not authorized to updated member
    if (!updatedMember)
      return res
        .status(401)
        .json({ access: false, message: "Member not found" });

    res.json({
      success: true,
      message: "Member is updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route DELETED api/member/delete
// @decs DELETE member
// @access Private
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const memberDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedMember = await Member.findOneAndDelete(memberDeleteCondition);

    //Member not authorized to delete member
    if (!deletedMember)
      return res
        .status(401)
        .json({ access: false, message: "Member not found" });

    res.json({
      success: true,
      message: "Member is deleted successfully",
      member: deletedMember,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
