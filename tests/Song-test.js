var expect = require('chai').expect;
var Song = require('../lib/Song.js');

describe('Song', function () {
  beforeEach(function () {
    this.subject = new Song();
  });

  it('has patterns', function () {
    expect(this.subject.patterns).to.deep.equal({});
  });

  describe('addPattern', function () {
    it('adds patterns to the existing patters', function () {
      var samplePattern = {name: 'kick', pattern: '..x..x..'};
      this.subject.addPattern(samplePattern);
      expect(Object.keys(this.subject.patterns)).to.deep.eq(['kick']);
      expect(this.subject.patterns.kick).to.eq(samplePattern.pattern);
    });

    context('when pattern is under acceptable length', function () {
      it('pads pattern to nearest acceptable length', function () {
        var five = {name: 'kick', pattern: '..xxx'};
        var seventeen = {name: 'highhat', pattern: '..x..x....x..x.xx'};
        expect(this.subject.addPattern(five).pattern).to.eq('..xxx...');
        expect(this.subject.addPattern(seventeen).pattern).to.eq('..x..x....x..x.xx...............');
      });
    });

    context('when pattern is over max length', function () {
      it('it cuts to the max length', function () {
        var forty = {name: 'highhat', pattern: '..x..x....x..x.xx..x..x....x..x.xx..x..x'};
        var expectedResult = '..x..x....x..x.xx..x..x....x..x.';
        expect(this.subject.addPattern(forty).pattern).to.eq(expectedResult);
      });
    });
  });
});
