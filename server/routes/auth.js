const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const authController = require("../controllers/authController");

router.get("/verify/:token", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/me", authController.getProfile);
router.post("/register", upload.single("avatarFile"), authController.register);
router.put("/me", upload.single("avatarFile"), authController.updateProfile);
router.post("/contest/apply", authController.applyToContest);

router.get("/contest/applications", authController.getAllContestApplications);
router.post(
  "/contest/applications/:id/approve",
  authController.approveApplication
);
router.post(
  "/contest/applications/:id/reject",
  authController.rejectApplication
);
router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getUserById);
router.put("/users/:id", authController.updateUserById);
router.get("/contest/approved/:track", authController.getApprovedByTrack);

module.exports = router;
