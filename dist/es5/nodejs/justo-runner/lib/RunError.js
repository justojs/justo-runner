/**
 * Base for the errors throwing by the runner.
 *
 * @param item:Item     The item throwing the error.
 * @param error:object  The error thrown.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RunError = (function (_Error) {
  _inherits(RunError, _Error);

  /**
   * Constructor.
   *
   * @param(attr) item
   * @param(attr) error
   */

  function RunError(item, error) {
    _classCallCheck(this, RunError);

    _get(Object.getPrototypeOf(RunError.prototype), "constructor", this).call(this, { message: error.toString() });

    Object.defineProperty(this, "item", { value: item, enumerable: true });
    Object.defineProperty(this, "error", { value: error, enumerable: true });
  }

  return RunError;
})(Error);

exports["default"] = RunError;
module.exports = exports["default"];
