//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _justoInjector = require("justo-injector");

/**
 * A runner.
 */

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

exports["default"] = Runner;
module.exports = exports["default"];
