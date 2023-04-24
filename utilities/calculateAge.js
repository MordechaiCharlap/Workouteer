const calculateAge = (dateToCheck) => {
  var today = new Date();
  var age = today.getFullYear() - dateToCheck.getFullYear();
  var m = today.getMonth() - dateToCheck.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
    age--;
  }
  return age;
};
export default calculateAge;
