var expect = require('chai').expect;
var Song = require('../lib/Song.js');

describe('Song', function () {
  beforeEach(function () {
    this.subject = new Song();
  });

  it('has patterns', function () {
    expect(this.subject.patterns).to.deep.equal({});
  });

  it('is created with a title', function () {
    this.subject = new Song('Dance!');
    expect(this.subject.title).to.eq('Dance!');
  });

  it('is created with a default BPM', function () {
    expect(this.subject.bpm).to.eq(128);
  });

  describe('validateBPM', function () {
    it('converts a string to integer', function () {
      var result = this.subject.validateBPM('133');
      expect(result).to.eq(133);
    });

    it('throws not a number error if not valid integer', function () {
      function result() { this.subject.validateBPM('sdfsd'); }
      expect(result.bind(this)).to.throw(TypeError, /Not a number/);
    });

    it('throws an error if above reasonable bpm', function () {
      function result() { this.subject.validateBPM(1000); }
      expect(result.bind(this)).to.throw(TypeError, /BPM out of reasonable range/);
    });

    it('throws an error if bpm is 0', function () {
      function result() { this.subject.validateBPM(0); }
      expect(result.bind(this)).to.throw(TypeError, /BPM out of reasonable range/);
    });
  });

  describe('validatePattern', function () {
    context('when pattern is an acceptable pattern length', function () {
      it('handles a pattern of 8 beats', function () {
        var pattern = '.x...x..';
        var result = this.subject.validatePattern(pattern);
        expect(result).to.eq(pattern);
      });

      it('handles a pattern of 16 beats', function () {
        var pattern = '...............x';
        var result = this.subject.validatePattern(pattern);
        expect(result).to.eq(pattern);
      });

      it('handles a pattern of 32 beats', function () {
        var pattern = '...x...........x...x...........x';
        var result = this.subject.validatePattern(pattern);
        expect(result).to.eq(pattern);
      });
    });

    context('when pattern is under acceptable length', function () {
      it('pads pattern to nearest acceptable length', function () {
        var five = '..xxx';
        var seventeen = '..x..x....x..x.xx';
        expect(this.subject.validatePattern(five)).to.eq('..xxx...');
        expect(this.subject.validatePattern(seventeen)).to.eq('..x..x....x..x.xx...............');
      });
    });

    context('when pattern is over max length', function () {
      it('it cuts to the max length', function () {
        var forty = '..x..x....x..x.xx..x..x....x..x.xx..x..x';
        var expectedResult = '..x..x....x..x.xx..x..x....x..x.';
        expect(this.subject.validatePattern(forty)).to.eq(expectedResult);
      });
    });

    context('when pattern does not contain correct chars', function () {
      it('removes any chars other than x or .', function () {
        var pattern = 'xx..2';
        var result = this.subject.validatePattern(pattern);
        expect(result).to.eq('xx......');
      });

      it('throws no valid pattern when all non pattern chars present', function () {
        var pattern = 'fsefsd';
        expect(this.subject.validatePattern.bind(null, pattern)).to.throw(TypeError, /No Valid Pattern Characters/);
      });

      it('throws no valid pattern when empty string', function () {
        var pattern = '';
        expect(this.subject.validatePattern.bind(null, pattern)).to.throw(TypeError, /No Valid Pattern Characters/);
      });
    });
  });

  describe('addPattern', function () {
    it('adds a new pattern to song\'s patterns', function () {
      var samplePattern = {name: 'kick', pattern: '..x..x..'};
      var convertedPattern = [null, null, 'kick', null, null, 'kick', null, null];
      this.subject.addPattern(samplePattern);
      expect(Object.keys(this.subject.patterns)).to.deep.eq(['kick']);
      expect(this.subject.patterns.kick).to.deep.eq(convertedPattern);
    });
  });

  describe('deletePattern', function () {
    beforeEach(function () {
      var kick = { name: 'kick', pattern: 'x...x...' };
      var snare = { name: 'snare', pattern: '....x...' };
      var hihat = { name: 'hihat', pattern: '..x...x.' };
      this.subject.addPattern(kick);
      this.subject.addPattern(snare);
      this.subject.addPattern(hihat);
    });

    it('should delete pattern by name', function () {
      var result = this.subject.deletePattern('snare');
      expect(result).to.eq(true);
      expect(Object.keys(this.subject.patterns)).to.deep.eq(['kick', 'hihat']);
      expect(this.subject.play()).to.deep.eq(['kick', '.', 'hihat', '.', 'kick', '.', 'hihat', '.']);
      result = this.subject.deletePattern('kick');
      expect(result).to.eq(true);
      expect(Object.keys(this.subject.patterns)).to.deep.eq(['hihat']);
      expect(this.subject.play()).to.deep.eq(['.', '.', 'hihat', '.', '.', '.', 'hihat', '.']);
      result = this.subject.deletePattern('gorgonzola');
      expect(result).to.eq(false);
      expect(Object.keys(this.subject.patterns)).to.deep.eq(['hihat']);
      expect(this.subject.play()).to.deep.eq(['.', '.', 'hihat', '.', '.', '.', 'hihat', '.']);
      result = this.subject.deletePattern('hihat');
      expect(result).to.eq(true);
      expect(Object.keys(this.subject.patterns)).to.deep.eq([]);
      expect(this.subject.play()).to.deep.eq([]);
      result = this.subject.deletePattern('hihat');
      expect(result).to.eq(false);
      expect(Object.keys(this.subject.patterns)).to.deep.eq([]);
      expect(this.subject.play()).to.deep.eq([]);
    });
  });

  describe('play', function () {
    context('with patterns', function () {
      beforeEach(function () {
        var kick = { name: 'kick', pattern: 'x...x...' };
        var snare = { name: 'snare', pattern: '....x...' };
        var hihat = { name: 'hihat', pattern: '..x...x.' };
        this.subject.addPattern(kick);
        this.subject.addPattern(snare);
        this.subject.addPattern(hihat);
      });

      it('returns a song composed of patterns', function () {
        var result = this.subject.play();
        expect(result).to.deep.eq(['kick', '.', 'hihat', '.', 'kick+snare', '.', 'hihat', '.']);
      });

      it('repeats patterns to match longest pattern', function () {
        var clap = { name: 'clap', pattern: '...............x'};
        this.subject.addPattern(clap);
        var result = this.subject.play();
        var expected = ['kick', '.', 'hihat', '.', 'kick+snare', '.', 'hihat', '.', 'kick', '.', 'hihat', '.', 'kick+snare', '.', 'hihat', 'clap'];
        expect(result).to.deep.eq(expected);
      });

      it('does not infinitely loop on an empty pattern', function () {
        var hihat = { name: 'clap', pattern: '' };
        this.subject.addPattern(hihat);
        var result = this.subject.play();
        expect(result).to.deep.eq(['kick', '.', 'hihat', '.', 'kick+snare', '.', 'hihat', '.']);
      });
    });

    context('without patterns', function () {
      it('returns an empty string', function () {
        var result = this.subject.play();
        expect(result).to.deep.eq([]);
      });
    });
  });
});
