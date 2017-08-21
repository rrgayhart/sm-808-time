var readline = require('readline');
var Song = require('../lib/Song.js');
var styleOutput = require('./styleOutput.js');
var verifyYesNo = require('./verifyYesNo.js');

var PROMPT = '> ';
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var song;

welcomeOutput();

function welcomeOutput() {
  var welcome = styleOutput('Welcome to the SM 808 Time', 'cyan');
  console.log(welcome);
  createSong();
  getTitle();
}

function createSong() {
  song = new Song();
}

function getTitle() {
  var text = [
    styleOutput('What would you like to name your song?', 'underscore'),
    PROMPT
  ];
  var output = text.join('\n');
  rl.question(output, respondToTitle);
}

function respondToTitle(answer) {
  song.title = answer;
  promptConfirmation(song.title, getBPM, getTitle);
}

function getBPM() {
  var text = [
    styleOutput('Please input a BPM', 'underscore'),
    'or hit enter to use the default 128 BPM',
    PROMPT
  ];
  var output = text.join('\n');
  rl.question(output, respondToBPM);
}

function respondToBPM(answer) {
  try {
    if (answer.length) {
      song.bpm = song.validateBPM(answer);
    }
    confirmBPM();
  }  catch (e) {
    outputError(e);
    return getBPM();
  }
}

function confirmBPM() {
  promptConfirmation(song.bpm, getPattern, getBPM);
}

function getPattern() {
  console.log('pattern.');
}

function promptConfirmation(conf, yesCB, noCB) {
  var text = [
    'You responded with',
    styleOutput(conf, ['bright', 'yellow', 'bgBlack']),
    'is this correct?' ];
  var line = text.join(' ');
  var opts = styleOutput('(y/n)', 'dim');
  var output = [line, opts, PROMPT].join('\n');
  rl.question(output, function (answer) {
    verifyYesNo(answer) ?  yesCB() : noCB();
  });
}

function outputError(e) {
  var line = [
    styleOutput('Warning', ['red']),
    'your input returned the following error:',
    styleOutput(e.message, ['red', 'bright'])
  ];
  console.log(line.join(' '));
}
