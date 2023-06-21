const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../utils/crudApiHandler");
const getAllAlerts = async (req, res) => {
  const alerts = await getAll("alerts");
  res.json(alerts);
};
const getAlertsById = async (req, res) => {
  const alertId = req.params.id;
  const alert = await getById("alerts", alertId);
  res.json(alert);
};

const createAlerts = async (req, res) => {
  const alertData = req.body;
  await create("alerts", alertData, req.params.id);
  res.sendStatus(201);
};

const updateAlerts = async (req, res) => {
  const alertId = req.params.id;
  const changes = req.body;
  await update("alerts", alertId, changes);
  res.sendStatus(200);
};

const deleteAlerts = async (req, res) => {
  const alertId = req.params.id;
  await remove("alerts", alertId);
  res.sendStatus(200);
};

router.get("/", getAllAlerts);
router.get("/:id", getAlertsById);
router.post("/:id", createAlerts);
router.put("/:id", updateAlerts);
router.delete("/:id", deleteAlerts);

module.exports = router;
