"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 









Task = (function () {









  function Task(opts) {_classCallCheck(this, Task);

    if (typeof opts == "string") opts = { name: opts };
    if (!opts.name) throw new Error("Expected task name.");


    Object.defineProperty(this, "name", { value: opts.name, enumerable: true });
    Object.defineProperty(this, "namespace", { value: opts.namespace || opts.ns, enumerable: true });
    Object.defineProperty(this, "description", { value: opts.description || opts.desc, enumerable: true });
    Object.defineProperty(this, "title", { value: opts.title || this.name, enumerable: true });
    Object.defineProperty(this, "ignore", { value: opts.hasOwnProperty("ignore") ? !!opts.ignore : false, enumerable: true });
    Object.defineProperty(this, "mute", { value: opts.hasOwnProperty("mute") ? !!opts.mute : false, enumerable: true });}_createClass(Task, [{ key: "isSimple", value: 







































































    function isSimple() {
      throw new Error("Abstract method.");} }, { key: "isComposite", value: 








    function isComposite() {
      throw new Error("Abstract method.");} }, { key: "isMacro", value: 








    function isMacro() {
      throw new Error("Abstract method.");} }, { key: "isWorkflow", value: 








    function isWorkflow() {
      throw new Error("Abstract method.");} }, { key: "ns", get: function get() {return this.namespace;} }, { key: "fullQualifiedName", get: function get() {return (this.namespace ? this.namespace + "." : "") + this.name;} }, { key: "fqn", get: function get() {return this.fullQualifiedName;} }, { key: "desc", get: function get() {return this.description;} }, { key: "synchronous", get: function get() {throw new Error("Abstract property.");} }, { key: "sync", get: function get() {return this.synchronous;} }, { key: "asynchronous", get: function get() {return !this.sync;} }, { key: "async", get: function get() {return this.asynchronous;} }]);return Task;})();exports["default"] = Task;module.exports = exports["default"];