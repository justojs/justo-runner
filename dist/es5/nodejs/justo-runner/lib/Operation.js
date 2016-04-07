"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _SimpleTask2 = require("./SimpleTask");var _SimpleTask3 = _interopRequireDefault(_SimpleTask2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 






Operation = function (_SimpleTask) {_inherits(Operation, _SimpleTask);






  function Operation(opts, fn) {_classCallCheck(this, Operation);return _possibleConstructorReturn(this, Object.getPrototypeOf(Operation).call(this, 
    opts, fn));}_createClass(Operation, [{ key: "isOfSuite", value: function isOfSuite() 

















    {
      return this.name == Operation.SUITE;} }, { key: "isOfForEach", value: function isOfForEach() 







    {
      return this.name == Operation.FOR_EACH;} }, { key: "isOfSpecificTest", value: function isOfSpecificTest() 







    {
      return !(this.isOfSuite() || this.isOfForEach());} }, { key: "title", get: function get() {throw new Error("Abstract property");} }], [{ key: "SUITE", get: function get() 


    {
      return "__suite__";} }, { key: "FOR_EACH", get: function get() 


    {
      return "*";} }]);return Operation;}(_SimpleTask3.default);exports.default = Operation;
