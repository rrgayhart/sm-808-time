var readline = require('readline');
var Song = require('../lib/Song.js');
var styleOutput = require('./styleOutput.js');
var verifyYesNo = require('./verifyYesNo.js');
var sampleSong = require('./sampleSong.js');

var PROMPT = '> ';
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var bannerC = 'cyan';
var promptC = 'underscore';
var highlightC = ['magenta', 'bright', 'bgBlack'];
var inputC = ['bright', 'yellow', 'bgBlack'];
var detailC = ['dim', 'cyan'];
var warningC = ['red', 'bright'];
var successC = ['green', 'bright'];

var song;

welcomeOutput();

function welcomeOutput() {
  var welcome = styleOutput('Welcome to the SM 808 Time\n', bannerC);
  console.log(welcome);
  var promptText = ('Press [enter] to create a new song');
  var additionalDetails = (['or type ',
    styleOutput('(s)', detailC),
    'ample to use a demo song.'
  ].join(''));
  promptInformation(promptText, createOrDefault, additionalDetails);
}

function createOrDefault(answer) {
  if (/^s(ample)*$/i.test(answer)) {
    song = sampleSong;
    promptMajorOptions();
  } else {
    createSong();
  }
}

function createSong() {
  song = new Song();
  getTitle();
}

function getTitle() {
  var promptText = 'What would you like to name your song?';
  var cb = respondToTitle;
  promptInformation(promptText, cb);
}

function respondToTitle(answer) {
  song.title = answer;
  promptConfirmation(song.title, getBPM, getTitle);
}

function getBPM() {
  var promptText = 'Please input a BPM';
  var additionalDetails = [
    'or',
    styleOutput('[ENTER]', detailC),
    'to use the default'
  ].join(' ');
  var cb = respondToBPM;
  promptInformation(promptText, cb, additionalDetails);
}

function respondToBPM(answer) {
  try {
    if (answer.length) {
      song.bpm = song.validateBPM(answer);
    } else {
      song.bpm = 128;
    }
    confirmBPM();
  }  catch (e) {
    outputError(e);
    return getBPM();
  }
}

function confirmBPM() {
  var cb = (Object.keys(song.patterns).length > 0) ? promptMajorOptions : getPatternData;
  promptConfirmation(song.bpm, cb, getBPM);
}

function getPatternData() {
  console.log('I will now ask you to input a pattern');
  var promptText = 'Enter the type of sound';
  var additionalDetails = ['e.g.', styleOutput('kick, hihat, etc...', detailC)].join(' ');
  var cb = getPattern;
  promptInformation(promptText, cb, additionalDetails);
}

function getPattern(answer) {
  var data = {name: answer};
  var promptText = 'Please input a pattern using 8, 16 or 32 steps';
  var line1 = [ 'Use',
    styleOutput('.', highlightC),
    'for empty steps and',
    styleOutput('x', highlightC),
    'when you want to play the',
    styleOutput(answer, inputC)
  ].join(' ');
  var line2 = ['e.g.', styleOutput('..x..x..', detailC)].join(' ');
  var additionalDetails = [line1, line2].join('\n');
  var cb = validatePattern.bind(this, data);
  promptInformation(promptText, cb, additionalDetails);
}

function validatePattern(data, answer) {
  try {
    var validatedPattern = song.validatePattern(answer);
    data.pattern = validatedPattern;
    confirmPattern(data);
  } catch (e) {
    outputError(e);
    return getPattern(data.name);
  }
}

function confirmPattern(data) {
  var line1 = 'Does this pattern information look correct?';
  var line2 = [
    'A',
    styleOutput(data.name, inputC),
    'sample in',
    styleOutput(data.pattern.length, highlightC),
    styleOutput('steps', highlightC),
    'with a pattern of',
    styleOutput(data.pattern, inputC)
  ].join(' ');
  var text = [line1, line2].join('\n');
  promptYesNo(text, addPattern.bind(this, data), getPatternData);
}

function addPattern(data) {
  song.addPattern(data);
  promptMajorOptions();
}

function promptMajorOptions() {
  var promptText = [
    styleOutput('Would you like to:', promptC),
    '\n',
    styleOutput(' (p)', detailC),
    'lay the entire song\n',
    styleOutput(' (a)', detailC),
    'dd another pattern\n',
    styleOutput(' (d)', detailC),
    'elete a pattern\n',
    ' change ',
    styleOutput('(b)', detailC),
    'pm\n',
    ' create a ',
    styleOutput('(n)', detailC),
    'ew song'].join('');
  var output = [promptText, PROMPT].join('\n');
  rl.question(output, handleMajorOptChoice);
}

function handleMajorOptChoice(answer) {
  if (/^a(dd)*$/i.test(answer)) { return getPatternData(); }
  if (/^d(elete)*$/i.test(answer)) { return getDeleteData(); }
  if (/^p(lay)*$/i.test(answer)) { return getPlayData(); }
  if (/^b(pm)*$/i.test(answer)) { return getBPM(); }
  if (/^n(ew)*$/i.test(answer)) { warnNewSong(); }
  console.log(styleOutput(answer, inputC), 'not recognized');
  promptMajorOptions();
}

function warnNewSong() {
  var text = [
    '',
    styleOutput('Creating a new song will destroy current song.', warningC),
    'Do you wish to proceed?'
  ].join('\n');
  return promptYesNo(text, createSong, promptMajorOptions);
}

function getDeleteData() {
  var patternNames = Object.keys(song.patterns);
  if (patternNames.length === 0) { return warnNoBloodFromStone(); }
  listPatterns(patternNames);
  var text = 'Please enter the name of the pattern you would like to delete';
  promptInformation(text, validateDelete);
}

function warnNoBloodFromStone() {
  var text = [
    styleOutput('Delete unavailable.', warningC),
    'Song has no patterns'
  ].join(' ');
  console.log(text);
  promptMajorOptions();
}

function validateDelete(answer) {
  var text = [
    'Are you sure you want to delete the',
    styleOutput(answer, inputC),
    'pattern?'
  ].join(' ');
  var yesCB = processDelete.bind(this, answer);
  promptYesNo(text, yesCB, promptMajorOptions);
}

function processDelete(p) {
  if (song.deletePattern(p)) {
    console.log([styleOutput('Success.', successC), 'Deleted pattern', p].join(' '));
  } else {
    console.log([styleOutput('Delete unsuccessful.', warningC), 'No pattern matching', p, 'found.'].join(' '));
  }
  promptMajorOptions();
}

function getPlayData() {
  var promptText = 'How many loops would you like to play?';
  var additionalDetails = [styleOutput('[enter]', detailC), 'to play one loop'].join(' ');
  var cb = validateLoopInput;
  promptInformation(promptText, cb, additionalDetails);
}

function validateLoopInput(answer) {
  if (answer.length === 0) {
    playSong();
  } else if (/^[0-9]{1,2}$/.test(answer)) {
    playSong(parseInt(answer, 10));
  } else {
    console.log(styleOutput('Invalid Loop', warningC), 'please enter a number between 1 - 99');
    getPlayData();
  }
}

function playSong(loop) {
  var text = [
    'Now playing your song',
    styleOutput(song.title, bannerC),
    'at',
    styleOutput(song.bpm, inputC),
    'beats per minute'
  ].join(' ');
  console.log(text);
  console.log(styleOutput('\n---------\n', bannerC));
  runSongInterval(loop);
}

function runSongInterval(loopData) {
  var interval = ((1000 * 60) / song.bpm);
  var stanza = song.play();
  var counter = 0;
  var loop = loopData || 1;
  var timer = setInterval(function () {
    if (loop <= 0) { return endSongPlay(timer); }
    rl.write(stanza[counter]);
    counter++;
    if (counter === stanza.length) {
      rl.write('\n');
      counter = 0;
      loop--;
    } else {
      rl.write('  ');
    }
  }, interval);
}

function endSongPlay(timer) {
  clearInterval(timer);
  promptMajorOptions();
}

function listPatterns(names) {
  var patternNames = names || Object.keys(song.patterns);
  var line1 = 'You have the following patterns stored:';
  var patternText = patternNames.map(function (p) {
    return [' - ', styleOutput(p, detailC)].join('');
  }).join('\n');
  var addedDetails = [line1, patternText].join('\n');
  console.log(addedDetails);
}

function promptInformation(promptText, cb, additionalDetails) {
  var text = [
    styleOutput(promptText, promptC),
    additionalDetails,
    PROMPT
  ];
  var output = text.filter(Boolean).join('\n');
  rl.question(output, cb);
}

function promptConfirmation(conf, yesCB, noCB) {
  var text = [
    'You responded with',
    styleOutput(conf, inputC),
    'is this correct?' ];
  var line = text.join(' ');
  promptYesNo(line, yesCB, noCB);
}

function promptYesNo(text, yesCB, noCB) {
  var opts = styleOutput('(y/n)', detailC);
  var output = [text, opts, PROMPT].join('\n');
  rl.question(output, function (answer) {
    verifyYesNo(answer) ?  yesCB() : noCB();
  });
}

function outputError(e) {
  console.log('\n');
  var line = [
    styleOutput('Warning', warningC),
    'your input returned the following error:',
    styleOutput(e.message, warningC)
  ];
  console.log(line.join(' '));
  console.log('\n');
}
