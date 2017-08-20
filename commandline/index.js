var readline = require('readline');
var styleOutput = require('./styleOutput.js');
var PROMPT = '> ';
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

welcomeOutput();

function welcomeOutput() {
  var text = [
    styleOutput('Welcome to the SM 808 Time', 'cyan'),
    styleOutput('What would you like to name your song?', 'underscore'),
    PROMPT
  ];
  var output = text.join('\n');
  rl.question(output, respondToTitle);
}

function respondToTitle(answer) {
  var text = [
    'You responded with',
    styleOutput(answer, ['bright', 'yellow', 'bgBlack']),
    'is this correct?' ];
  var line = text.join(' ');
  var opts = styleOutput('(Y/N)', 'dim');
  var output = ['\n', line, opts, PROMPT].join('\n');
  rl.question(output, verifyTitle);
}

function verifyTitle(answer) {
  
}
