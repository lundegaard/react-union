'use strict';

exports.__esModule = true;
exports.Union = undefined;

var _shapes = require('./shapes');

Object.keys(_shapes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _shapes[key];
    }
  });
});

var _dom = require('./dom');

Object.keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dom[key];
    }
  });
});

var _Union2 = require('./components/Union');

var _Union3 = _interopRequireDefault(_Union2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Union = _Union3.default;