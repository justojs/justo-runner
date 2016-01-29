"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _justoFs = require("justo-fs");var 
fs = _interopRequireWildcard(_justoFs);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}


var catalog = Symbol();
var catalogWorkflow = Symbol();
var catalogMacro = Symbol();
var catalogSimple = Symbol();var 






Catalog = function () {





  function Catalog(runner) {_classCallCheck(this, Catalog);
    Object.defineProperty(this, "tasks", { enumerable: true, value: {} });
    Object.defineProperty(this, "runner", { enumerable: true, value: runner });
    Object.defineProperty(this, "catalog", { enumerable: true, value: this[catalog].bind(this) });
    Object.defineProperty(this.catalog, "workflow", { enumerable: true, value: this[catalogWorkflow].bind(this) });
    Object.defineProperty(this.catalog, "macro", { enumerable: true, value: this[catalogMacro].bind(this) });
    Object.defineProperty(this.catalog, "simple", { enumerable: true, value: this[catalogSimple].bind(this) });}_createClass(Catalog, [{ key: "add", value: function add(







    wrapper) {
      this.tasks[wrapper.__task__.fqn] = wrapper;} }, { key: "get", value: function get(








    fqn) {
      return this.tasks[fqn];} }, { key: "exists", value: function exists(








    fqn) {
      return !!this.tasks[fqn];} }, { key: 





























    catalog, value: function value() {
      var opts, task;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}


      if (args.length < 2) {
        throw new Error("Invalid number of arguments. At least, expected two: name or options and function or object[].");} else 
      if (args.length >= 2) {
        opts = args[0];task = args[1];}



      if (task instanceof Function) this[catalogWorkflow](opts, task);else 
      if (task instanceof Array || task instanceof Object) this[catalogMacro](opts, task);else 
      throw new Error("Invalid task to catalog.");} }, { key: 













    catalogWorkflow, value: function value(opts, fn) {
      this.add(this.runner.workflow(opts, fn));} }, { key: 













    catalogMacro, value: function value(opts, tasks) {
      this.add(this.runner.macro(opts, tasks));} }, { key: 













    catalogSimple, value: function value(opts, fn) {
      this.add(this.runner.simple(opts, fn));} }]);return Catalog;}();exports.default = Catalog;
