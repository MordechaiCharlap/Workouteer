const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../utils/crudApiHandler");
const getAllWorkouts = async (req, res) => {
  const allWorkouts = await getAll("workouts");
  res.json(allWorkouts);
};
const getWorkoutById = async (req, res) => {
  const workout = await getById("workouts", req.params.id);
  res.json(workout);
};
const createWorkout = async (req, res) => {
  const newWorkoutRef = await create("workouts", req.body);
  res.json(newWorkoutRef.id);
};
const updateWorkout = async (req, res) => {
  await update("workouts", req.params.id, req.body);
  res.sendStatus(200);
};
const deleteWorkout = async (req, res) => {
  await remove("workouts", req.params.id);
  res.json("Deleted succesfully");
};
router.get("/", getAllWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
