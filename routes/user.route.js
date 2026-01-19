const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  getUserList,
  updateUser,
  userDelete
} = require("../controllers/user.controller");

router.get("/", getUser);

router.post("/list", getUserList);

router.post("/create", createUser);

router.put("/update", updateUser);
router.delete("/:id", userDelete);

module.exports = router;
