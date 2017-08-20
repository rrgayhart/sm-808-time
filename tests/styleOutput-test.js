var expect = require('chai').expect;
var styleOutput = require('../commandline/styleOutput.js');

describe('styleOutput', function () {
  it('wraps single input in style and reset', function () {
    var s = 'Would you like to create a song?:';
    var result = styleOutput(s, 'cyan');
    expect(result).to.eq('\x1b[1;36mWould you like to create a song?:\x1b[0m');
  });

  it('handles an array of styles', function () {
    var s = 'Hello, world';
    var result = styleOutput(s, ['cyan', 'dim']);
    expect(result).to.eq('\x1b[1;36m\x1b[2mHello, world\x1b[0m');
  });
});
