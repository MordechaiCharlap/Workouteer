import languageService from "../services/languageService";

export const timeString = (date, language) => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const yasterday = new Date();
  yasterday.setDate(now.getDate() - 1);
  var day;
  var time;
  if (isSameDay(now, date)) day = languageService[language].today;
  else if (isSameDay(tomorrow, date)) day = languageService[language].tomorrow;
  else if (isSameDay(yasterday, date))
    day = languageService[language].yasterday;
  else {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    day = dd + "/" + mm;
  }
  const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const mm =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  time = hh + ":" + mm;
  return day + " " + time;
};
export const messageTimeString = (date, language) => {
  const currentDay = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const h = (date.getHours() < 10 ? "0" : "") + date.getHours();
  const m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  if (currentDay.getDate() == day) {
    return h + ":" + m;
  } else {
    const yasterday = new Date();
    yasterday.setDate(yasterday.getDate() - 1);
    if (yasterday.toDateString() == date.toDateString()) {
      return languageService[language].yasterday + " " + h + ":" + m;
    }
    return `${day}/${month} ${h}:${m}`;
  }
};
export const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
