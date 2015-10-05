"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _justoInjector = require("justo-injector");

/**
 * Base for the errors throwing by the runner.
 *
 * @param item:Item     The item throwing the error.
 * @param error:object  The error thrown.
 */

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

  /**
   * A runner.
   */
  return RunError;
})(Error);

exports.RunError = RunError;

var Runner = (function () {
  function Runner() {
    _classCallCheck(this, Runner);
  }

  _createClass(Runner, [{
    key: "runSync",

    /**
     * Runs a function synchronously.
     * Returns an object with the result: time, milliseconds; and error, if failed.
     *
     * @param fn:function The function to run.
     * @param con:object  The run context.
     * @param opts:object The run options: params (object), timeout (number).
     *
     * @return object
     */
    value: function runSync(fn, con, opts) {
      var args, start, end, error;

      //(1) run
      if (opts.params) args = (0, _justoInjector.inject)({ params: opts.params }, fn);else args = [];

      try {
        start = Date.now();
        fn.apply(con || fn, args);
      } catch (e) {
        error = e;
      } finally {
        end = Date.now();
      }

      //(2) return result
      return { time: end - start, error: error };
    }

    /**
     * Runs a function asynchronously.
     *
     * @param fn:function   The function to run.
     * @param con:object    The run context.
     * @param opts:object   The run options: params and timeout.
     * @param done:function The function to call: fn({time, error}).
     */
  }, {
    key: "runAsync",
    value: function runAsync(fn, con, opts, _done) {
      var args, start, end, error;

      //(1) run
      args = (0, _justoInjector.inject)({
        params: opts.params,
        done: function done(error) {
          end = Date.now();
          _done({ time: end - start, error: error });
        }
      }, fn);

      try {
        start = Date.now();
        fn.apply(con || fn, args);
      } catch (e) {
        error = e;
        end = Date.now();
        _done({ time: end - start, error: error });
      }
    }
  }]);

  return Runner;
})();

exports.Runner = Runner;
