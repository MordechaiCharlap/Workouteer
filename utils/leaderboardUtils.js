export const getLastWeekId = () => {
  var lastSunday = new Date();
  const dayOfTheWeek = lastSunday.getDay();
  lastSunday.setDate(lastSunday.getDate() - dayOfTheWeek);
  const weekId = `${lastSunday.getDate()}-${
    lastSunday.getMonth() + 1
  }-${lastSunday.getFullYear()}`;
  return weekId;
};
