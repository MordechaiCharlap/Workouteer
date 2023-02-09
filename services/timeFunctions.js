export const timeString = (date) => {
  const now = new Date();
  var day;
  var time;
  if (now.getDate() == date.getDate()) day = "Today";
  else if (now.getDate() + 1 == date.getDate()) day = "Tomorrow";
  else {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    day = dd + "/" + mm;
  }
  const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const mm =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  time = hh + ":" + mm;
  return day + ", " + time;
};
export const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
