/*
 * PURPOSE: some convenient functions for writing stores
 */

function somePath(base) {
  return base.concat(Array.prototype.slice.call(arguments, 1));
}

function trim(str) {
  // Ok, it is a little weird. Refactor if this causes trobule again.
  if (typeof(str) === 'string')
    return str.replace(/\s/g, '');
  else
    return str? 'on' : '';
}

module.exports = {somePath, trim};
