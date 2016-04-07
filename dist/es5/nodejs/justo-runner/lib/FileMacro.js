"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _CompositeTask2 = require("./CompositeTask");var _CompositeTask3 = _interopRequireDefault(_CompositeTask2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 




FileMacro = function (_CompositeTask) {_inherits(FileMacro, _CompositeTask);







    function FileMacro(opts, config) {_classCallCheck(this, FileMacro);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FileMacro).call(this, 

        opts));


        config = Object.assign({}, config);

        if (!config.require) config.require = [];else 
        if (typeof config.require == "string") config.require = [config.require];

        if (!config.src) config.src = [];else 
        if (typeof config.src == "string") config.src = [config.src];


        Object.defineProperty(_this, "src", { value: config.src, enumerable: true });
        Object.defineProperty(_this, "require", { value: config.require, enumerable: true });return _this;}return FileMacro;}(_CompositeTask3.default);exports.default = FileMacro;
