export const checkIfDateAvailableAndReturnClosestWorkout = (
  user,
  dateToCheck
) => {
  console.log("test");
  var closestWorkoutDate = null;
  for (var value of Object.values(user.workouts)) {
    if (
      new Date(value[0].toDate().getTime() + value[1] * 60000) > dateToCheck &&
      value[0].toDate() < dateToCheck
    ) {
      return false;
    } else if (
      value[0].toDate() > dateToCheck &&
      (closestWorkoutDate == null || closestWorkoutDate > value[0].toDate())
    )
      closestWorkoutDate = value[0].toDate();
  }
  return closestWorkoutDate;
};
