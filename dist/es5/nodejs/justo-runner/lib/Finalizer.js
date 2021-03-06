"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _Operation2 = require("./Operation");var _Operation3 = _interopRequireDefault(_Operation2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var




Finalizer = function (_Operation) {_inherits(Finalizer, _Operation);function Finalizer() {_classCallCheck(this, Finalizer);return _possibleConstructorReturn(this, (Finalizer.__proto__ || Object.getPrototypeOf(Finalizer)).apply(this, arguments));}_createClass(Finalizer, [{ key: "title", get: function get()



    {
      var res;


      if (this.isOfSuite()) res = "fin()";else
      if (this.isOfForEach()) res = "fin(*)";else
      res = "fin(" + this.name + ")";

      if (this._title) res += " - " + this._title;


      return res;
    } }]);return Finalizer;}(_Operation3.default);exports.default = Finalizer;
