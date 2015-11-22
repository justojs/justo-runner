"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 







Item = (function () {









  function Item(opts) {_classCallCheck(this, Item);

    if (typeof opts == "string") opts = { name: opts };
    if (!opts.name) throw new Error("Expected task name.");


    Object.defineProperty(this, "name", { value: opts.name, enumerable: true });
    Object.defineProperty(this, "description", { value: opts.description || opts.desc, enumerable: true });}_createClass(Item, [{ key: "desc", get: 





    function get() {
      return this.description;} }, { key: "synchronous", get: 








    function get() {
      throw new Error("Abstract property.");} }, { key: "sync", get: 





    function get() {
      return this.synchronous;} }, { key: "asynchronous", get: 







    function get() {
      return !this.sync;} }, { key: "async", get: 





    function get() {
      return this.asynchronous;} }]);return Item;})();exports["default"] = Item;module.exports = exports["default"];
