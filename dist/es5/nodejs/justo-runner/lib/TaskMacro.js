"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _CompositeTask2 = require("./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 






TaskMacro = function (_CompositeTask) {_inherits(TaskMacro, _CompositeTask);











  function TaskMacro(opts, tasks) {_classCallCheck(this, TaskMacro);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskMacro).call(this, 

    opts));


    Object.defineProperty(_this, "tasks", { value: [], enumerable: true });var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var task = _step.value;_this.add(task);}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}return _this;}_createClass(TaskMacro, [{ key: "add", value: function add(
















    task) {
      this.tasks.push(task);} }, { key: "length", get: function get() {return this.tasks.length;} }, { key: "synchronous", get: function get() 





    {
      var res;


      res = true;

      for (var i = 0, tasks = this.tasks; res && i < tasks.length; ++i) {
        if (tasks[i].async) res = false;}



      return res;} }]);return TaskMacro;}(_CompositeTask3.default);exports.default = TaskMacro;
