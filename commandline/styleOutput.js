var reset = '\x1b[0m';
var styles = {
  cyan: '\x1b[1;36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  underscore: '\x1b[4m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  bgBlack: '\x1b[40m'
};

module.exports = function (s, styleInput) {
  var customStyles = styles[styleInput] || '';

  if (styleInput && styleInput.constructor === Array) {
    styleInput.forEach(function (style) {
      customStyles += styles[style];
    });
  }

  return (customStyles + s + reset);
};
