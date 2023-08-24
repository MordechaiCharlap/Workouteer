import { Timestamp } from "firebase/firestore";

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
export const removeBadPlannedWorkoutsAndReturnFixed = (user) => {
  const now = new Date();
  const unconfirmedWorkouts = JSON.parse(JSON.stringify(user.plannedWorkouts));
  for (const [key, value] of Object.entries(user.plannedWorkouts)) {
    if (new Date(value[0].toDate().getTime() + value[1] * 60000) > now) {
      unconfirmedWorkouts[key][0] = new Timestamp(
        unconfirmedWorkouts[key][0].seconds,
        unconfirmedWorkouts[key][0].nanoseconds
      );
      continue;
    }
    delete unconfirmedWorkouts[key];
  }
  return unconfirmedWorkouts;
};
export const getMemberStatus = (user, workout) => {
  if (workout.creator == user.id) return "creator";
  if (workout.members[user.id] != null) return "member";
  if (workout.invites[user.id] != null) return "invited";
  if (workout.requests[user.id] != null) {
    if (workout.requests[user.id] == true) {
      return "pending";
    } else {
      return "rejected";
    }
  } else if (
    (workout.sex == "men" && !user.isMale) ||
    (workout.sex == "women" && user.isMale)
  )
    return "cannot";
  else return "not";
};
