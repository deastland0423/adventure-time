// Convert normal x, y hex coordinates to the traditional XXYY coordinates
const hexCoordsDisplay = (xCoord, yCoord) => {
  let displayX = padNumber(xCoord, 2);
  let displayY = padNumber(yCoord, 2);
  return `${displayX}${displayY}`;
}

// Pad any number out to a string with <digits> digits
const padNumber = (value, digits) => {
  return `000000000000000000000000000000000000000000000${value}`.slice(-digits);
}

const dateOnlyFormat = (date) =>
  date.getFullYear() + '-' +
  padNumber(date.getMonth() + 1, 2) + '-' +
  padNumber(date.getDate(), 2);

const timeOnlyFormat = (date) =>
  padNumber(date.getHours(), 2) + ':' +
  padNumber(date.getMinutes(), 2);

const dateTimeFormat = (date) =>
  dateOnlyFormat(date) + ' ' + timeOnlyFormat(date);

module.exports = { hexCoordsDisplay, padNumber, dateOnlyFormat, timeOnlyFormat, dateTimeFormat };
