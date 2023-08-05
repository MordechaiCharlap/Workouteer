export const checkIfDateAvailableAndReturnClosestWorkout = (
  user,
  dateToCheck
) => {
  var closestWorkoutDate = null;
  for (var value of Object.values(user.plannedWorkouts)) {
    if (
      new Date(value[0].toDate().getTime() + value[1] * 60000) > dateToCheck &&
      value[0].toDate().getTime() <= dateToCheck.getTime()
    ) {
      return false;
    } else if (
      value[0].toDate() > dateToCheck &&
      (closestWorkoutDate == null || value[0].toDate() < closestWorkoutDate)
    )
      closestWorkoutDate = value[0].toDate();
  }
  return closestWorkoutDate;
};
