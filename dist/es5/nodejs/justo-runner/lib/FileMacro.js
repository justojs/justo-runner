"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _get = function get(_x, _x2, _x3) {var _again = true;_function: while (_again) {var object = _x, property = _x2, receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {var parent = Object.getPrototypeOf(object);if (parent === null) {return undefined;} else {_x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;}} else if ("value" in desc) {return desc.value;} else {var getter = desc.get;if (getter === undefined) {return undefined;}return getter.call(receiver);}}};function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _CompositeTask2 = require(
"./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);var 




FileMacro = (function (_CompositeTask) {_inherits(FileMacro, _CompositeTask);







    function FileMacro(opts, config) {_classCallCheck(this, FileMacro);

        _get(Object.getPrototypeOf(FileMacro.prototype), "constructor", this).call(this, opts);


        config = Object.assign({}, config);

        if (!config.require) config.require = [];else 
        if (typeof config.require == "string") config.require = [config.require];

        if (!config.src) config.src = [];else 
        if (typeof config.src == "string") config.src = [config.src];


        Object.defineProperty(this, "src", { value: config.src, enumerable: true });
        Object.defineProperty(this, "require", { value: config.require, enumerable: true });}return FileMacro;})(_CompositeTask3["default"]);exports["default"] = FileMacro;module.exports = exports["default"];
