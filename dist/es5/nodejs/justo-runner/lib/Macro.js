"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _CompositeTask2 = require(
"./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);var 






Macro = (function (_CompositeTask) {_inherits(Macro, _CompositeTask);











  function Macro(opts, tasks) {_classCallCheck(this, Macro);

    _get(Object.getPrototypeOf(Macro.prototype), "constructor", this).call(this, opts);


    Object.defineProperty(this, "tasks", { value: [], enumerable: true });var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var task = _step.value;this.add(task);}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"]) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}_createClass(Macro, [{ key: "add", value: 
















    function add(t) {

      if (t instanceof Function) t = { task: t, params: undefined };
      if (!t.task) throw new Error("No task of macro indicated.");
      if (!t.title) {
        if (t.task.__task__) t.title = t.task.__task__.name;else 
        t.title = t.task.name || "anonymous";}



      this.tasks.push(t);} }, { key: "isSimple", value: 






















    function isSimple() {
      return false;} }, { key: "isComposite", value: 





    function isComposite() {
      return true;} }, { key: "isMacro", value: 





    function isMacro() {
      return true;} }, { key: "isWorkflow", value: 





    function isWorkflow() {
      return false;} }, { key: "length", get: function get() {return this.tasks.length;} }, { key: "synchronous", get: function get() {var res;res = true;for (var i = 0, tasks = this.tasks; res && i < tasks.length; ++i) {if (tasks[i].async) res = false;}return res;} }]);return Macro;})(_CompositeTask3["default"]);exports["default"] = Macro;module.exports = exports["default"];
