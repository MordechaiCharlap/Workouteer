const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../utils/crudApiHandler");
const getAllUsers = async (req, res) => {
  const users = await getAll("users");
  res.json(users);
};
const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await getById("users", userId);
  res.json(user);
};

const createUser = async (req, res) => {
  const userData = req.body;
  await create("users", userData);
  res.sendStatus(201);
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const changes = req.body;
  await update("users", userId, changes);
  res.sendStatus(200);
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await remove("users", userId);
  res.sendStatus(200);
};

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
