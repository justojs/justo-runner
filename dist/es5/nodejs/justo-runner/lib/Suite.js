"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _CompositeTask2 = require("./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);
var _Initializer = require("./Initializer");var _Initializer2 = _interopRequireDefault(_Initializer);
var _Finalizer = require("./Finalizer");var _Finalizer2 = _interopRequireDefault(_Finalizer);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 




Suite = function (_CompositeTask) {_inherits(Suite, _CompositeTask);





  function Suite(opts) {_classCallCheck(this, Suite);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Suite).call(this, 
    opts));

    Object.defineProperty(_this, "initializers", { value: [], enumerable: true });
    Object.defineProperty(_this, "finalizers", { value: [], enumerable: true });
    Object.defineProperty(_this, "_forEachInitializers", { value: [] });
    Object.defineProperty(_this, "_forEachFinalizers", { value: [] });
    Object.defineProperty(_this, "testInitializers", { value: [], enumerable: true });
    Object.defineProperty(_this, "testFinalizers", { value: [], enumerable: true });
    Object.defineProperty(_this, "tasks", { value: [], enumerable: true });
    Object.defineProperty(_this, "_parent", { value: undefined, writable: true });
    Object.defineProperty(_this, "_only", { value: !!opts.only });return _this;}_createClass(Suite, [{ key: "hasParent", value: function hasParent() 











    {
      return !!this._parent;} }, { key: "add", value: function add(





































































    wrapper) {
      var task = wrapper.__task__;

      if (task instanceof _Initializer2.default) {
        if (task.isOfSuite()) this.initializers.push(wrapper);else 
        if (task.isOfForEach()) this._forEachInitializers.push(wrapper);else 
        this.testInitializers.push(wrapper);} else 
      if (task instanceof _Finalizer2.default) {
        if (task.isOfSuite()) this.finalizers.push(wrapper);else 
        if (task.isOfForEach()) this._forEachFinalizers.push(wrapper);else 
        this.testFinalizers.push(wrapper);} else 
      {
        this.tasks.push(wrapper);
        task._parent = this;}} }, { key: "getSpecificInitializersOf", value: function getSpecificInitializersOf(































    name) {
      var inits;


      inits = [];var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

        for (var _iterator = this.testInitializers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var init = _step.value;
          if (init.__task__.name == name) inits.push(init);}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}



      return inits;} }, { key: "getSpecificFinalizersOf", value: function getSpecificFinalizersOf(








    name) {
      var fins;


      fins = [];var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

        for (var _iterator2 = this.testFinalizers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var fin = _step2.value;
          if (fin.__task__.name == name) fins.push(fin);}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}



      return fins;} }, { key: "parent", get: function get() {return this._parent;} }, { key: "only", get: function get() {var res;if (this._only || this.hasParent() && this.parent._only) {res = true;} else {res = false;var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = this.tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var child = _step3.value;if (child.__task__.only) {res = true;break;}}} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}}return res;} }, { key: "fullyOnly", get: function get() {var onlys;if (this._only) {onlys = 0;} else {onlys = 0;var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = this.tasks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var child = _step4.value;onlys += child.__task__.only ? 1 : 0;}} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}}return onlys === 0;} }, { key: "hasOnly", get: function get() {} }, { key: "forEachInitializers", get: function get() {return (this.parent ? this.parent.forEachInitializers : []).concat(this._forEachInitializers);} }, { key: "forEachFinalizers", get: function get() {return (this.parent ? this.parent.forEachFinalizers : []).concat(this._forEachFinalizers);} }]);return Suite;}(_CompositeTask3.default);exports.default = Suite;
