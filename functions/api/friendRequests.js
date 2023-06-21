const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../utils/crudApiHandler");
const getAllFriendRequests = async (req, res) => {
  const allFriendRequests = await getAll("friendRequests");
  res.json(allFriendRequests);
};
const getFriendRequestsById = async (req, res) => {
  const userId = req.params.id;
  const friendRequests = await getById("friendRequests", userId);
  res.json(friendRequests);
};

const createFriendRequests = async (req, res) => {
  const friendRequestsData = req.body;
  await create("friendRequests", friendRequestsData, req.params.id);
  res.sendStatus(201);
};

const updateFriendRequests = async (req, res) => {
  const userId = req.params.id;
  const changes = req.body;
  await update("friendRequests", userId, changes);
  res.sendStatus(200);
};

const deleteFriendRequests = async (req, res) => {
  const userId = req.params.id;
  await remove("friendRequests", userId);
  res.sendStatus(200);
};

router.get("/", getAllFriendRequests);
router.get("/:id", getFriendRequestsById);
router.post("/id", createFriendRequests);
router.put("/:id", updateFriendRequests);
router.delete("/:id", deleteFriendRequests);

module.exports = router;
