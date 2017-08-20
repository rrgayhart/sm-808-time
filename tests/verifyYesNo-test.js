var expect = require('chai').expect;
var verifyYesNo = require('../commandline/verifyYesNo.js');

describe('verifyYesNo', function () {
  it('should return true for a yes or yes-like answer', function () {
    var possibleYesResponses = [
      'y',
      'Y',
      'yes',
      'YES',
      'YeS',
      'Y ',
      '(y)'
    ]
    possibleYesResponses.forEach(function(resp){
      expect(verifyYesNo(resp)).to.eq(true, ('Failed on ' + resp));
    });
  });

  it('should return false for a no or no-like response', function(){
    var possibleNoResponses = [
      'n',
      'N',
      'no',
      'asdfsesd',
      'y a x',
      'noyes'
    ]
    possibleNoResponses.forEach(function(resp){
      expect(verifyYesNo(resp)).to.eq(false, ('Failed on ' + resp));
    });
  });
});
