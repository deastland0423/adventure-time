// Convert normal x, y hex coordinates to the traditional XXYY coordinates
const hexCoordsDisplay = (xCoord, yCoord) => {

  let displayX = padNumber(xCoord, 2);
  let displayY = padNumber(yCoord, 2);
  // let displayY = yCoord <= 9 ? `0${yCoord}`.slice(-2) : `${yCoord}`;

  return `${displayX}${displayY}`;

}

// Pad any number out to a string with <digits> digits
const padNumber = (value, digits) => {

  return `000000000000000000000000000000000000000000000${value}`.slice(-digits);

}

module.exports = { hexCoordsDisplay, padNumber };