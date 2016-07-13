"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _CompositeTask2 = require("./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 








Test = function (_CompositeTask) {_inherits(Test, _CompositeTask);






  function Test(opts, fn) {_classCallCheck(this, Test);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Test).call(this, 

    opts));


    Object.defineProperty(_this, "fn", { value: fn, enumerable: true });
    Object.defineProperty(_this, "_parent", { value: undefined, writable: true });
    Object.defineProperty(_this, "only", { value: !!opts.only, enumerable: true });
    Object.defineProperty(_this, "params", { value: opts.params, writable: true, enumerable: true });return _this;}_createClass(Test, [{ key: "hasParams", value: function hasParams() 











    {
      return !!this.params;} }, { key: "parent", get: function get() {return this._parent;} }, { key: "initializers", get: function get() 







    {
      var parent = this._parent;
      return parent.forEachInitializers.concat(parent.getSpecificInitializersOf(this.name));} }, { key: "finalizers", get: function get() 







    {
      var parent = this._parent;
      return parent.forEachFinalizers.concat(parent.getSpecificFinalizersOf(this.name));} }]);return Test;}(_CompositeTask3.default);exports.default = Test;
