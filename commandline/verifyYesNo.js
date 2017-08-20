module.exports = function (answer) {
  var re = /^( )*[y](es)*( )*$/i;
  return re.test(answer);
};
