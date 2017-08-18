var PATTERN_LS = [8, 16, 32];
var MAX_PAT_L = 32;
var EMPTY_CHAR = '.';

function Song() {
  this.patterns = {};
}

Song.prototype.addPattern = function (data) {
  var cleanData = cleanPattern(data);
  this.patterns[data.name] = cleanData.pattern;
  return cleanData;
};

function cleanPattern(data) {
  data.pattern = padPattern(data.pattern);
  return data;
}

function padPattern(pattern) {
  var l = pattern.length;
  if (PATTERN_LS.includes(l)) { return pattern; }
  if (l > MAX_PAT_L) { return pattern.slice(0, MAX_PAT_L); }
  return padPattern(pattern + EMPTY_CHAR);
}

module.exports = Song;
