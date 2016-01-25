"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _SimpleTask2 = require(
"./SimpleTask");var _SimpleTask3 = _interopRequireDefault(_SimpleTask2);var 






Operation = (function (_SimpleTask) {_inherits(Operation, _SimpleTask);






  function Operation(opts, fn) {_classCallCheck(this, Operation);
    _get(Object.getPrototypeOf(Operation.prototype), "constructor", this).call(this, opts, fn);}_createClass(Operation, [{ key: "isOfSuite", value: 

















    function isOfSuite() {
      return this.name == Operation.SUITE;} }, { key: "isOfForEach", value: 







    function isOfForEach() {
      return this.name == Operation.FOR_EACH;} }, { key: "isOfSpecificTest", value: 







    function isOfSpecificTest() {
      return !(this.isOfSuite() || this.isOfForEach());} }, { key: "title", get: function get() {throw new Error("Abstract property");} }], [{ key: "SUITE", get: 


    function get() {
      return "__suite__";} }, { key: "FOR_EACH", get: 


    function get() {
      return "*";} }]);return Operation;})(_SimpleTask3["default"]);exports["default"] = Operation;module.exports = exports["default"];
