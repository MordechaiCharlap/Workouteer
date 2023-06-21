export const convertHexToRgba = (hex, opacity) => {
  // Remove the hash mark if it exists
  hex = hex.replace("#", "");

  // Split the hex value into three components
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as a string
  return `rgba(${r}, ${g}, ${b}, ${opacity != null ? opacity : 1})`;
};
