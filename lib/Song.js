var PATTERN_LS = [8, 16, 32];
var MAX_PAT_L = 32;
var EMPTY_CHAR = '.';

function Song(title) {
  this.patterns = {};
  this.title = title;
  this.bpm = 128;
}

Song.prototype.validateBPM = function (input) {
  var bpm = parseInt(input, 10);
  if (isNaN(bpm)) { throw new TypeError('Not a number'); }
  if (bpm === 0 || bpm > 500) { throw new TypeError('BPM out of reasonable range'); }
  return bpm;
};

Song.prototype.cleanPattern = function (data) {
  data.pattern = padPattern(data.pattern);
  return data;
};

Song.prototype.addPattern = function (data) {
  var convertedPattern = [];
  for (var i = 0; i < data.pattern.length; i++) {
    var patternHolder = data.pattern.charAt(i) === 'x' ? data.name : null;
    convertedPattern[i] = patternHolder;
  }
  this.patterns[data.name] = convertedPattern;
};

Song.prototype.deletePattern = function (name) {
  return (name in this.patterns) && delete this.patterns[name];
};

Song.prototype.play = function () {
  var patterns = Object.values(this.patterns);
  var maxStep = Math.max.apply(null, patterns.map(function (a) {return a.length;}));
  var song = prepareSongData(patterns, maxStep);
  return song.join('|');
};

function prepareSongData(patterns, maxStep) {
  var song = [];
  patterns.forEach(function (pattern) {
    if (pattern.length === 0 ) { return; }
    var adjustedPattern = repeatTillMax(pattern, maxStep);
    addPatternToSong(adjustedPattern, song);
  });
  return song;
}

function repeatTillMax(pattern, max) {
  return pattern.length >= max ? pattern : repeatTillMax(pattern.concat(pattern), max);
}

function addPatternToSong(pattern, song) {
  pattern.forEach(function (beat, i) {
    if (!song[i] || song[i] === '.') { return (song[i] = beat || '.'); }
    if (beat) { return (song[i] = song[i] + '+' + beat); }
  });
}

function padPattern(pattern) {
  var l = pattern.length;
  if (PATTERN_LS.includes(l)) { return pattern; }
  if (l > MAX_PAT_L) { return pattern.slice(0, MAX_PAT_L); }
  return padPattern(pattern + EMPTY_CHAR);
}

module.exports = Song;
