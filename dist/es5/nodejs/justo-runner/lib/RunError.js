"use strict";Object.defineProperty(exports, "__esModule", { value: true });function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var





RunError = function (_Error) {_inherits(RunError, _Error);






  function RunError(item, error) {_classCallCheck(this, RunError);var _this = _possibleConstructorReturn(this, (RunError.__proto__ || Object.getPrototypeOf(RunError)).call(this,
    { message: error.toString() }));

    Object.defineProperty(_this, "item", { value: item, enumerable: true });
    Object.defineProperty(_this, "error", { value: error, enumerable: true });return _this;
  }return RunError;}(Error);exports.default = RunError;
