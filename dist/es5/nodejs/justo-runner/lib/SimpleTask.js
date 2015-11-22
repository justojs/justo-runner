"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _justoInjector = require(
"justo-injector");var _Task2 = require(
"./Task");var _Task3 = _interopRequireDefault(_Task2);var 








SimpleTask = (function (_Task) {_inherits(SimpleTask, _Task);











  function SimpleTask(opts, fn) {_classCallCheck(this, SimpleTask);

    if (!fn) throw new Error("Task function expected.");


    _get(Object.getPrototypeOf(SimpleTask.prototype), "constructor", this).call(this, opts);


    Object.defineProperty(this, "fn", { value: fn, enumerable: true });
    Object.defineProperty(this, "synchronous", { value: !(0, _justoInjector.hasParameter)("done", this.fn), enumerable: true });
    Object.defineProperty(this, "parameterized", { value: (0, _justoInjector.hasParameter)("params", this.fn), enumerable: true });}_createClass(SimpleTask, [{ key: "isSimple", value: 




























    function isSimple() {
      return true;} }, { key: "isComposite", value: 





    function isComposite() {
      return false;} }, { key: "isMacro", value: 





    function isMacro() {
      return false;} }, { key: "isWorkflow", value: 





    function isWorkflow() {
      return false;} }, { key: "sync", get: function get() {return this.synchronous;} }, { key: "asynchronous", get: function get() {return !this.sync;} }, { key: "async", get: function get() {return this.asynchronous;} }]);return SimpleTask;})(_Task3["default"]);exports["default"] = SimpleTask;module.exports = exports["default"];
