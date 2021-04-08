/**
 * Safely get a deeply-nested property from an object, when it (or any part of the path hierarchy) may not exist.
 * @link: https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 * @param object obj The object to be traversed.
 * @param array path Sequence of property names defining the path to the desired property.
 * @return mixed|null Return the value or NULL if not found.
 */
const safeGetProp = (obj, path, default_value = null) =>
  path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : default_value, obj)

function padTime(number) {
    if (number < 10) return `0${number}`;
    return number;
}

const dateOnlyFormat = (date) =>
  date.getFullYear() + '-' +
  padTime(date.getMonth() + 1) + '-' +
  padTime(date.getDate());

const timeOnlyFormat = (date) =>
  padTime(date.getHours()) + ':' +
  padTime(date.getMinutes());

const dateTimeFormat = (date) =>
  dateOnlyFormat(date) + ' ' + timeOnlyFormat(date);

module.exports = { safeGetProp, dateOnlyFormat, timeOnlyFormat, dateTimeFormat };