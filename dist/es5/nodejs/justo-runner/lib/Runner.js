"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var _justoInjector = require(
"justo-injector");var _justoTask = require(
"justo-task");


var task = Symbol();
var macro = Symbol();
var runSimpleTask = Symbol();
var runMacro = Symbol();var 







Runner = (function () {





  function Runner(config) {_classCallCheck(this, Runner);

    if (!config) throw new Error("Expected runner configuration.");
    if (!config.reporters) throw new Error("Expected reporters.");
    if (!config.loggers) throw new Error("Expected loggers.");


    Object.defineProperty(this, "loggers", { value: config.loggers, enumerable: true });
    Object.defineProperty(this, "reporters", { value: config.reporters, enumerable: true });
    Object.defineProperty(this, "task", { value: this[task].bind(this), enumerable: true });
    Object.defineProperty(this, "macro", { value: this[macro].bind(this), enumerable: true });}_createClass(Runner, [{ key: 






































    task, value: function value() {var _this = this;
      var ns, name, opts, fn, tsk, wrapper;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, the task function must be passed.");} else 
      if (args.length == 1) {
        fn = args[0];} else 
      if (args.length == 2) {
        if (typeof args[0] == "string") {;name = args[0];fn = args[1];} else {
          ;opts = args[0];fn = args[1];}} else 
      if (args.length == 3) {
        if (typeof args[1] == "object") {;name = args[0];opts = args[1];fn = args[2];} else {
          ;ns = args[0];name = args[1];fn = args[2];}} else 
      if (args.length >= 4) {
        ns = args[0];name = args[1];opts = args[2];fn = args[3];}


      if (!name) name = fn.name;
      if (!opts) opts = {};


      tsk = new _justoTask.SimpleTask(ns, name, opts, fn);


      wrapper = function (opts) {for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}

        if (!opts) throw new Error("Invalid number of arguments. At least, the title must be specified.");
        if (typeof opts == "string") opts = { title: opts };


        return _this[runSimpleTask](tsk, opts, params);};


      Object.defineProperty(wrapper, "task", { value: tsk });

      Object.defineProperty(wrapper, "ignore", { 
        value: function value(opts) {for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {params[_key3 - 1] = arguments[_key3];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { ignore: true })].concat(params));}, 

        enumerable: true });


      Object.defineProperty(wrapper, "mute", { 
        value: function value(opts) {for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {params[_key4 - 1] = arguments[_key4];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { mute: true })].concat(params));}, 

        enumerable: true });



      return wrapper;} }, { key: 









    runSimpleTask, value: function value(task, opts, params) {
      var title, res, state, err, start, end;


      title = opts.title || task.fqn;


      if (!opts.mute) this.reporters.start(title, task);

      if (opts.ignore) {
        this.loggers.debug("Ignoring simple task '" + title + "'.");
        state = "ignored";} else 
      {
        try {
          var fn = task.fn;
          params = (0, _justoInjector.inject)({ params: params, logger: this.loggers, log: this.loggers }, fn);
          this.loggers.debug("Starting run of simple task '" + title + "'.");
          start = Date.now();
          res = fn.apply(undefined, _toConsumableArray(params));} 
        catch (e) {
          err = e;} finally 
        {
          end = Date.now();}


        state = err ? "failed" : "ok";
        this.loggers.debug("Ended run of simple task '" + title + "' in '" + state + "' state.");}


      if (!opts.mute) this.reporters.end(task, state, err, start, end);


      return res;} }, { key: 







































    macro, value: function value() {var _this2 = this;
      var ns, name, opts, tasks, wrapper, mcr;for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {args[_key5] = arguments[_key5];}


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, the array of tasks must be passed.");} else 
      if (args.length == 1) {
        tasks = args[0];} else 
      if (args.length == 2) {
        if (typeof args[0] == "string") {;name = args[0];tasks = args[1];} else {
          ;opts = args[0];tasks = args[1];}} else 
      if (args.length == 3) {
        if (typeof args[1] == "string") {;ns = args[0];name = args[1];tasks = args[2];} else {
          ;name = args[0];opts = args[1];tasks = args[2];}} else 
      if (args.length >= 4) {
        ns = args[0];name = args[1];opts = args[2];tasks = args[3];}


      if (!name) name = "macro";
      if (!opts) opts = {};


      mcr = new _justoTask.Macro(ns, name, opts, tasks);


      wrapper = function (opts) {for (var _len6 = arguments.length, params = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {params[_key6 - 1] = arguments[_key6];}

        if (!opts) throw new Error("Invalid number of arguments. At least, the title must be specified.");
        if (typeof opts == "string") opts = { title: opts };


        return _this2[runMacro](mcr, opts, params);};


      Object.defineProperty(wrapper, "macro", { value: mcr });

      Object.defineProperty(wrapper, "ignore", { 
        value: function value(opts) {for (var _len7 = arguments.length, params = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {params[_key7 - 1] = arguments[_key7];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { ignore: true })].concat(params));}, 

        enumerable: true });


      Object.defineProperty(wrapper, "mute", { 
        value: function value(opts) {for (var _len8 = arguments.length, params = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {params[_key8 - 1] = arguments[_key8];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { mute: true })].concat(params));}, 

        enumerable: true });



      return wrapper;} }, { key: 









    runMacro, value: function value(macro, opts, params) {
      var title, res, state, err, start, end, self;


      self = this;
      title = opts.title;
      params = params.length === 0 ? undefined : params;


      if (!opts.mute) this.reporters.start(title, macro);

      if (opts.ignore) {
        this.loggers.debug("Ignoring macro '" + title + "'.");
        state = "ignored";} else 
      {
        this.loggers.debug("Starting run of macro '" + title + "'.");

        try {
          start = Date.now();var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

            for (var _iterator = macro.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var t = _step.value;
              var _task = t.task;
              var pp = params || t.params || [];

              if (_task.task && _task.task instanceof _justoTask.SimpleTask) {
                this[runSimpleTask](_task.task, opts, pp);} else 
              if (_task.macro && _task.macro instanceof _justoTask.Macro) {
                this[runMacro](_task.macro, opts, pp);} else 
              {
                _task.apply(undefined, _toConsumableArray(pp));}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"]) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}} 


        catch (e) {
          err = e;} finally 
        {
          end = Date.now();}


        state = err ? "failed" : "ok";
        this.loggers.debug("Ended run of macro '" + title + "' in '" + state + "' state.");}


      if (!opts.mute) this.reporters.end(macro, state, err, start, end);} }, { key: "start", value: 







    function start(title) {
      this.reporters.start(title);
      this.loggers.debug("Starting report '" + title + "'.");} }, { key: "end", value: 





    function end() {
      this.reporters.end();
      this.loggers.debug("Ending report.");} }], [{ key: "DEFAULT_DISPLAY", get: 


    function get() {
      return DEFAULT_DISPLAY;} }, { key: "DEFAULT_LOGGER_OPTIONS", get: 


    function get() {
      return DEFAULT_LOGGER_OPTIONS;} }]);return Runner;})();exports["default"] = Runner;module.exports = exports["default"];
