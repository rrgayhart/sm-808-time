var expect = require('chai').expect;
var Song = require('../lib/Song.js');

describe('Song', function () {
  beforeEach(function () {
    this.subject = new Song();
  });

  it('has patterns', function () {
    expect(this.subject.patterns).to.deep.equal({});
  });

  describe('cleanPattern', function () {
    context('when pattern is an acceptable pattern length', function () {
      it('handles a pattern of 8 beats', function () {
        var clap = {name: 'clap', pattern: '.x...x..'};
        var result = this.subject.cleanPattern(clap);
        expect(result).to.eq(clap);
      });

      it('handles a pattern of 16 beats', function () {
        var clap = {name: 'clap', pattern: '...............x'};
        var result = this.subject.cleanPattern(clap);
        expect(result).to.eq(clap);
      });

      it('handles a pattern of 32 beats', function () {
        var clap = {name: 'clap', pattern: '...x...........x...x...........x'};
        var result = this.subject.cleanPattern(clap);
        expect(result).to.eq(clap);
      });
    });

    context('when pattern is under acceptable length', function () {
      it('pads pattern to nearest acceptable length', function () {
        var five = {name: 'kick', pattern: '..xxx'};
        var seventeen = {name: 'highhat', pattern: '..x..x....x..x.xx'};
        expect(this.subject.cleanPattern(five).pattern).to.eq('..xxx...');
        expect(this.subject.cleanPattern(seventeen).pattern).to.eq('..x..x....x..x.xx...............');
      });
    });

    context('when pattern is over max length', function () {
      it('it cuts to the max length', function () {
        var forty = {name: 'highhat', pattern: '..x..x....x..x.xx..x..x....x..x.xx..x..x'};
        var expectedResult = '..x..x....x..x.xx..x..x....x..x.';
        expect(this.subject.cleanPattern(forty).pattern).to.eq(expectedResult);
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
      expect(this.subject.patterns.keys).to.deep.eq(['kick', 'hihat']);
      expect(this.subject.play).to.eq('');
      result = this.subject.deletePattern('kick');
      expect(result).to.eq(true);
      expect(this.subject.patterns.keys).to.deep.eq(['hihat']);
      expect(this.subject.play).to.eq('');
      this.subject.deletePattern('gorgonzola');
      expect(result).to.eq(false);
      expect(this.subject.patterns.keys).to.deep.eq(['hihat']);
      expect(this.subject.play).to.eq('');
      result = this.subject.deletePattern('hihat');
      expect(result).to.eq(true);
      expect(this.subject.patterns.keys).to.deep.eq([]);
      expect(this.subject.play).to.eq('');
      result = this.subject.deletePattern('hihat');
      expect(result).to.eq(false);
      expect(this.subject.patterns.keys).to.deep.eq([]);
      expect(this.subject.play).to.eq('');
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
        expect(result).to.eq('kick|.|hihat|.|kick+snare|.|hihat|.');
      });

      it('repeats patterns to match longest pattern', function () {
        var clap = { name: 'clap', pattern: '...............x'};
        this.subject.addPattern(clap);
        var result = this.subject.play();
        var expected = 'kick|.|hihat|.|kick+snare|.|hihat|.|kick|.|hihat|.|kick+snare|.|hihat|clap';
        expect(result).to.eq(expected);
      });

      it('does not infinitely loop on an empty pattern', function () {
        var hihat = { name: 'clap', pattern: '' };
        this.subject.addPattern(hihat);
        var result = this.subject.play();
        expect(result).to.eq('kick|.|hihat|.|kick+snare|.|hihat|.');
      });
    });

    context('without patterns', function () {
      it('returns an empty string', function () {
        var result = this.subject.play();
        expect(result).to.eq('');
      });
    });
  });
});
