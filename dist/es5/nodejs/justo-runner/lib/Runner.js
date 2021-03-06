"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _justoInjector = require("justo-injector");
var _justoResult = require("justo-result");
var _justoLoader = require("justo-loader");
var _justoFs = require("justo-fs");var fs = _interopRequireWildcard(_justoFs);
var _SimpleTask = require("./SimpleTask");var _SimpleTask2 = _interopRequireDefault(_SimpleTask);
var _FileMacro = require("./FileMacro");var _FileMacro2 = _interopRequireDefault(_FileMacro);
var _TaskMacro = require("./TaskMacro");var _TaskMacro2 = _interopRequireDefault(_TaskMacro);
var _Workflow = require("./Workflow");var _Workflow2 = _interopRequireDefault(_Workflow);
var _RunError = require("./RunError");var _RunError2 = _interopRequireDefault(_RunError);
var _Catalog = require("./Catalog");var _Catalog2 = _interopRequireDefault(_Catalog);
var _Stack = require("./Stack");var _Stack2 = _interopRequireDefault(_Stack);
var _Initializer = require("./Initializer");var _Initializer2 = _interopRequireDefault(_Initializer);
var _Finalizer = require("./Finalizer");var _Finalizer2 = _interopRequireDefault(_Finalizer);
var _Suite = require("./Suite");var _Suite2 = _interopRequireDefault(_Suite);
var _Test = require("./Test");var _Test2 = _interopRequireDefault(_Test);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}


var simple = Symbol();
var macro = Symbol();
var taskMacro = Symbol();
var fileMacro = Symbol();
var workflow = Symbol();
var suite = Symbol();
var test = Symbol();
var init = Symbol();
var fin = Symbol();
var runSyncSimpleTask = Symbol();
var runAsyncSimpleTask = Symbol();var







Runner = function () {





  function Runner(config) {var _this = this;_classCallCheck(this, Runner);

    if (!config) throw new Error("Expected runner configuration.");
    if (!config.reporters) throw new Error("Expected reporters.");
    if (!config.console) throw new Error("Expected console.");


    Object.defineProperty(this, "breakOnError", { value: config.onError == "break", enumerable: true });
    Object.defineProperty(this, "only", { value: !!config.only, enumerable: true });
    Object.defineProperty(this, "catalog", { value: new _Catalog2.default(this), enumerable: true });
    Object.defineProperty(this, "stack", { value: new _Stack2.default() });
    Object.defineProperty(this, "tasks", { value: [] });
    Object.defineProperty(this, "console", { value: config.console });
    Object.defineProperty(this, "reporters", { value: config.reporters, enumerable: true });
    Object.defineProperty(this, "simple", { value: this[simple].bind(this), enumerable: true });
    Object.defineProperty(this, "macro", { value: this[macro].bind(this), enumerable: true });
    Object.defineProperty(this, "workflow", { value: this[workflow].bind(this), enumerable: true });
    Object.defineProperty(this, "suite", { value: this[suite].bind(this), enumerable: true });
    Object.defineProperty(this, "test", { value: this[test].bind(this), enumerable: true });
    Object.defineProperty(this, "init", { value: this[init].bind(this), enumerable: true });
    Object.defineProperty(this, "fin", { value: this[fin].bind(this), enumerable: true });

    Object.defineProperty(this.suite, "only", { enumerable: true, value: function value() {
        var opts, def;

        if (arguments.length === 0) {
          throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
        } else if (arguments.length == 1) {
          opts = { only: true };
          def = arguments.length <= 0 ? undefined : arguments[0];
        } else if (arguments.length >= 2) {
          if (typeof (arguments.length <= 0 ? undefined : arguments[0]) == "string") opts = { name: arguments.length <= 0 ? undefined : arguments[0], only: true };else
          opts = arguments.length <= 0 ? undefined : arguments[0];

          def = arguments.length <= 1 ? undefined : arguments[1];
        }

        return _this.suite(opts, def);
      } });

    Object.defineProperty(this.test, "only", { enumerable: true, value: function value() {
        var opts, fn;

        if (arguments.length === 0) {
          throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
        } else if (arguments.length == 1) {
          opts = { only: true };
          fn = arguments.length <= 0 ? undefined : arguments[0];
        } else if (arguments.length >= 2) {
          if (typeof (arguments.length <= 0 ? undefined : arguments[0]) == "string") opts = { name: arguments.length <= 0 ? undefined : arguments[0], only: true };else
          opts = arguments.length <= 0 ? undefined : arguments[0];

          fn = arguments.length <= 1 ? undefined : arguments[1];
        }

        return _this.test(opts, fn);
      } });
  }_createClass(Runner, [{ key: "publishInto", value: function publishInto(















    obj) {
      Object.defineProperty(obj, "catalog", { value: this.catalog.catalog, enumerable: true, configurable: true });
      Object.defineProperty(obj, "register", { value: this.catalog.catalog, enumerable: true, configurable: true });
      Object.defineProperty(obj, "simple", { value: this.simple, enumerable: true, configurable: true });
      Object.defineProperty(obj, "macro", { value: this.macro, enumerable: true, configurable: true });
      Object.defineProperty(obj, "workflow", { value: this.workflow, enumerable: true, configurable: true });
      Object.defineProperty(obj, "suite", { value: this.suite, enumerable: true, configurable: true });
      Object.defineProperty(obj, "test", { value: this.test, enumerable: true, configurable: true });
      Object.defineProperty(obj, "init", { value: this.init, enumerable: true, configurable: true });
      Object.defineProperty(obj, "fin", { value: this.fin, enumerable: true, configurable: true });
    } }, { key: "unpublishFrom", value: function unpublishFrom(






    obj) {
      delete obj.catalog;
      delete obj.register;
      delete obj.simple;
      delete obj.macro;
      delete obj.workflow;
      delete obj.suite;
      delete obj.test;
      delete obj.init;
      delete obj.fin;
    } }, { key: "runCatalogedTasks", value: function runCatalogedTasks(

























    calls) {
      var wrapper;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {


        for (var _iterator = calls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var call = _step.value;
          if (!this.catalog.exists(call.name)) throw new Error("The '" + call.name + "' task is not cataloged.");
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {


        for (var _iterator2 = calls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _call = _step2.value;
          this.reporters.start(_call.name);
          this.catalog.get(_call.name).apply(undefined, [_call.name].concat(_toConsumableArray(_call.params)));
          this.reporters.end();
        }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
    } }, { key:





















    simple, value: function value() {var _this2 = this;for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      var opts, fn, task, wrapper;


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, one parameter must be passed (function or object).");
      } else if (args.length == 1) {
        if (args[0] instanceof Function) {
          fn = args[0];
          opts = {};
        } else {
          opts = args[0];
        }
      } else if (args.length >= 2) {
        opts = args[0];fn = args[1];
      }

      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) == "object" && !opts.name) opts.name = fn.name || "simple anonymous task";


      if (fn) {
        task = new _SimpleTask2.default(opts, fn);

        wrapper = function wrapper() {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
          var opts, params;


          if (args.length === 0) {
            opts = {};
            params = [];
          } else if (args.length == 1) {
            opts = args[0];
            params = [];
          } else if (args.length >= 2) {
            opts = args[0];
            params = args.slice(1);
          }

          if (typeof opts == "string") opts = { title: opts };


          return _this2.runSimpleTask(task, opts, params);
        };

        this.initWrapper(wrapper, task);
      } else {
        if (!opts.task) throw new Error("task option expected.");

        wrapper = this[workflow](opts, function () {
          return opts.task(opts, opts.params || []);
        });
      }


      return wrapper;
    } }, { key: "runSimpleTask", value: function runSimpleTask(









    task, opts, params) {
      var res;


      opts = Object.assign({ title: task.title, ignore: task.ignore, mute: task.mute }, opts);
      if (opts.hasOwnProperty("onlyIf")) opts.ignore = !opts.onlyIf;


      if (opts.ignore) {
        if (!opts.mute) this.reporters.ignore(opts.title, task);
      } else {
        if (task.sync) res = this[runSyncSimpleTask](task, opts, params);else
        this[runAsyncSimpleTask](task, opts, params);
      }


      return res;
    } }, { key:

    runSyncSimpleTask, value: function value(task, opts, params) {
      var res = void 0,state = void 0,err = void 0,start = void 0,end = void 0;


      try {
        var fn = task.fn;

        params = (0, _justoInjector.inject)({ params: params, console: this.console }, fn);

        if (!opts.mute) this.reporters.start(opts.title, task);

        start = Date.now();
        res = fn.apply(undefined, _toConsumableArray(params));
        state = _justoResult.ResultState.OK;
      } catch (e) {
        err = e;
        state = _justoResult.ResultState.FAILED;
      } finally {
        end = Date.now();
      }

      if (!opts.mute) this.reporters.end(task, state, err, start, end);
      if (err && this.breakOnError) throw new _RunError2.default(task, err);


      return res;
    } }, { key:

    runAsyncSimpleTask, value: function value(task, opts, params) {
      var state, err, start, end;

      try {
        var fn = task.fn;

        if (!opts.mute) this.reporters.start(opts.title, task);

        start = Date.now();
        err = this.runAsyncFunction(fn, params);
        state = err ? _justoResult.ResultState.FAILED : _justoResult.ResultState.OK;
      } catch (e) {
        err = e;
        state = _justoResult.ResultState.FAILED;
      } finally {
        end = Date.now();
      }

      if (!opts.mute) this.reporters.end(task, state, err, start, end);
      if (err && this.breakOnError) throw new _RunError2.default(task, err);
    } }, { key: "runAsyncFunction", value: function runAsyncFunction(










    fn, params) {var _this3 = this;
      var sync = require("justo-sync");
      var err;

      try {
        sync(function (done) {
          function jdone(err, res) {
            if (err) {
              if (err instanceof Error) done(err);else
              done(new Error(err));
            } else {
              done(undefined, res);
            }
          }

          params = (0, _justoInjector.inject)({ done: jdone, params: params, console: _this3.console }, fn);
          fn.apply(undefined, _toConsumableArray(params));
        });
      } catch (e) {
        err = e;
      }

      return err;
    } }, { key:
























    macro, value: function value() {
      var opts, tasks;for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}


      if (args.length < 2) {
        throw new Error("Invalid number of arguments. At least, two: name and array or object.");
      } else if (args.length >= 2) {
        opts = args[0];tasks = args[1];
      }


      if (tasks instanceof Array) return this[taskMacro](opts, tasks);else
      return this[fileMacro](opts, tasks);
    } }, { key:




    taskMacro, value: function value(opts, tasks) {var _this4 = this;
      var macro, wrapper;


      macro = new _TaskMacro2.default(opts, []);var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {

        for (var _iterator3 = tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var task = _step3.value;
          if (typeof task == "string") task = { title: task, task: task };
          if (typeof task.task == "string") {
            if (!this.catalog.exists(task.task)) throw new Error("The '" + task.task + "' task is not cataloged.");
            if (!task.title) task.title = task.task;
            task.task = this.catalog.get(task.task);
          }

          if (!task.hasOwnProperty("title")) throw new Error("Title must be specified.");
          if (!task.hasOwnProperty("task")) throw new Error("Task must be specified.");

          macro.add(task);
        }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}


      wrapper = function wrapper() {for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this4.runTaskMacro(macro, opts, params);
      };

      this.initWrapper(wrapper, macro);


      return wrapper;
    } }, { key: "runTaskMacro", value: function runTaskMacro(









    macro, opts, params) {
      var title, res;


      title = opts.title || macro.title;
      if (!opts.hasOwnProperty("ignore")) opts.ignore = macro.ignore;
      if (!opts.hasOwnProperty("mute")) opts.mute = macro.mute;
      params = params.length === 0 ? undefined : params;


      if (opts.ignore) {
        if (!opts.mute) this.reporters.ignore(title, macro);
      } else {
        var err = void 0;

        if (!opts.mute) this.reporters.start(title, macro);

        try {var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {
            for (var _iterator4 = macro.tasks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var task = _step4.value;
              try {
                var oo = { title: task.title, mute: opts.mute };
                var pp = params || task.params || [];

                task.task.apply(task, [oo].concat(_toConsumableArray(pp)));
              } catch (e) {
                err = e;
                if (this.breakOnError) break;
              }
            }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
        } finally {
          if (!opts.mute) this.reporters.end(macro);
        }
      }
    } }, { key:




    fileMacro, value: function value(opts, config) {var _this5 = this;
      var macro, wrapper;


      macro = new _FileMacro2.default(opts, config);


      wrapper = function wrapper() {for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {args[_key5] = arguments[_key5];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this5.runFileMacro(macro, opts, params);
      };

      this.initWrapper(wrapper, macro);


      return wrapper;
    } }, { key: "runFileMacro", value: function runFileMacro(

    macro, opts, params) {var _this6 = this;
      var title, res;
      var loadFile = function loadFile(file) {
        _this6.workflow(file, function () {_justoLoader.Loader.load(file);})({ title: file, mute: opts.mute });
      };
      var loadDir = function loadDir(dir) {var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {
          for (var _iterator5 = new fs.Dir(dir).entries[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var entry = _step5.value;
            if (entry instanceof fs.File) loadFile(entry.path);else
            if (entry instanceof fs.Dir) loadDir(entry.path);else
            loadFile(entry.path);
          }} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5.return) {_iterator5.return();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}
      };


      title = opts.title || macro.title;
      if (!opts.hasOwnProperty("ignore")) opts.ignore = macro.ignore;
      if (!opts.hasOwnProperty("mute")) opts.mute = macro.mute;
      params = params.length === 0 ? undefined : params;


      if (opts.ignore) {
        if (!opts.mute) this.reporters.ignore(title, macro);
      } else {
        var err = void 0;

        if (!opts.mute) this.reporters.start(title, macro);

        if (macro.require) {var _iteratorNormalCompletion6 = true;var _didIteratorError6 = false;var _iteratorError6 = undefined;try {
            for (var _iterator6 = macro.require[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {var pkg = _step6.value;require(pkg);}} catch (err) {_didIteratorError6 = true;_iteratorError6 = err;} finally {try {if (!_iteratorNormalCompletion6 && _iterator6.return) {_iterator6.return();}} finally {if (_didIteratorError6) {throw _iteratorError6;}}}
        }

        try {var _iteratorNormalCompletion7 = true;var _didIteratorError7 = false;var _iteratorError7 = undefined;try {
            for (var _iterator7 = macro.src[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {var src = _step7.value;
              var entry = void 0;

              try {
                try {
                  entry = fs.entry(src);
                } catch (e) {
                  entry = undefined;
                }

                if (entry instanceof fs.File) loadFile(src);else
                if (entry instanceof fs.Dir) loadDir(src);else
                loadFile(src);
              } catch (e) {
                err = e;
                if (this.breakOnError) break;
              }
            }} catch (err) {_didIteratorError7 = true;_iteratorError7 = err;} finally {try {if (!_iteratorNormalCompletion7 && _iterator7.return) {_iterator7.return();}} finally {if (_didIteratorError7) {throw _iteratorError7;}}}
        } finally {
          if (!opts.mute) this.reporters.end(macro);
        }
      }
    } }, { key:


















    workflow, value: function value() {var _this7 = this;for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {args[_key6] = arguments[_key6];}
      var opts, fn, task, wrapper;


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, the workflow function must be passed.");
      } else if (args.length == 1) {
        fn = args[0];
        opts = {};
      } else if (args.length >= 2) {
        opts = args[0];fn = args[1];
      }

      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) == "object" && !opts.name) opts.name = fn.name || "anonymous workflow";


      task = new _Workflow2.default(opts, fn);


      wrapper = function wrapper() {for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {args[_key7] = arguments[_key7];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this7.runWorkflow(task, opts, params);
      };

      this.initWrapper(wrapper, task);


      return wrapper;
    } }, { key: "runWorkflow", value: function runWorkflow(









    workflow, opts, params) {
      var title, res;


      title = opts.title || workflow.title;
      if (!opts.hasOwnProperty("ignore")) opts.ignore = workflow.ignore;
      if (!opts.hasOwnProperty("mute")) opts.mute = workflow.mute;


      if (opts.ignore) {
        if (!opts.mute) this.reporters.ignore(title, workflow);
      } else {
        var state = void 0,err = void 0,start = void 0,end = void 0;

        try {
          var fn = workflow.fn;
          params = (0, _justoInjector.inject)({ params: params, console: this.console }, fn);

          if (!opts.mute) this.reporters.start(title, workflow);

          start = Date.now();
          res = fn.apply(undefined, _toConsumableArray(params));
          state = _justoResult.ResultState.OK;
        } catch (e) {
          err = e;
          state = _justoResult.ResultState.FAILED;
        } finally {
          end = Date.now();
        }

        if (!opts.mute) this.reporters.end(workflow, state, err, start, end);
        if (err && this.breakOnError) throw new _RunError2.default(workflow, err);
      }


      return res;
    } }, { key:


















    suite, value: function value() {var _this8 = this;for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {args[_key8] = arguments[_key8];}
      var opts, def, task, wrapper;


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. Expected, at least, the definition function.");
      } else if (args.length == 1) {
        opts = {};
        def = args[0];
      } else if (args.length >= 2) {
        opts = args[0];def = args[1];
      }

      if (typeof opts == "string") opts = { name: opts };
      if (!opts.name) opts.name = "anonymous suite";


      task = new _Suite2.default(opts);


      this.stack.push(task);
      def();
      this.stack.pop();


      wrapper = function wrapper() {for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {args[_key9] = arguments[_key9];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        if (!_this8.only || _this8.only && (task.only || task.superonly || task.subonly)) {
          return _this8.runSuite(task, opts, params);
        }
      };

      this.initTestWrapper(wrapper, task);


      if (this.stack.length > 0) this.stack.top.add(wrapper);


      return wrapper;
    } }, { key: "runSuite", value: function runSuite(









    suite, opts, params) {
      var title, res;


      title = opts.title || suite.title;
      if (!opts.hasOwnProperty("mute")) opts.mute = suite.mute;


      if (opts.ignore || suite.ignore) {
        if (!opts.mute) this.reporters.ignore(title, suite);
      } else {
        var oo = {};
        if (opts.mute) oo.mute = true;


        if (!opts.mute) this.reporters.start(title, suite);var _iteratorNormalCompletion8 = true;var _didIteratorError8 = false;var _iteratorError8 = undefined;try {

          for (var _iterator8 = suite.initializers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {var _init = _step8.value;_init.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError8 = true;_iteratorError8 = err;} finally {try {if (!_iteratorNormalCompletion8 && _iterator8.return) {_iterator8.return();}} finally {if (_didIteratorError8) {throw _iteratorError8;}}}

        if (!this.only) {var _iteratorNormalCompletion9 = true;var _didIteratorError9 = false;var _iteratorError9 = undefined;try {
            for (var _iterator9 = suite.tasks[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {var task = _step9.value;task.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError9 = true;_iteratorError9 = err;} finally {try {if (!_iteratorNormalCompletion9 && _iterator9.return) {_iterator9.return();}} finally {if (_didIteratorError9) {throw _iteratorError9;}}}
        } else {
          if (suite.only || suite.superonly) {var _iteratorNormalCompletion10 = true;var _didIteratorError10 = false;var _iteratorError10 = undefined;try {
              for (var _iterator10 = suite.tasks[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {var _task = _step10.value;_task.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError10 = true;_iteratorError10 = err;} finally {try {if (!_iteratorNormalCompletion10 && _iterator10.return) {_iterator10.return();}} finally {if (_didIteratorError10) {throw _iteratorError10;}}}
          } else if (suite.subonly) {var _iteratorNormalCompletion11 = true;var _didIteratorError11 = false;var _iteratorError11 = undefined;try {
              for (var _iterator11 = suite.tasks[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {var _task2 = _step11.value;
                if (_task2.__task__.only || _task2.__task__.superonly || _task2.__task__.subonly) _task2.apply(undefined, [oo].concat(_toConsumableArray(params)));
              }} catch (err) {_didIteratorError11 = true;_iteratorError11 = err;} finally {try {if (!_iteratorNormalCompletion11 && _iterator11.return) {_iterator11.return();}} finally {if (_didIteratorError11) {throw _iteratorError11;}}}
          }
        }var _iteratorNormalCompletion12 = true;var _didIteratorError12 = false;var _iteratorError12 = undefined;try {

          for (var _iterator12 = suite.finalizers[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {var _fin = _step12.value;_fin.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError12 = true;_iteratorError12 = err;} finally {try {if (!_iteratorNormalCompletion12 && _iterator12.return) {_iterator12.return();}} finally {if (_didIteratorError12) {throw _iteratorError12;}}}

        if (!opts.mute) this.reporters.end(suite);
      }
    } }, { key:












    test, value: function value() {var _this9 = this;for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {args[_key10] = arguments[_key10];}
      var opts, fn, task, wrapper;


      if (this.stack.length === 0) {
        throw new Error("test() must be invoked into a suite.");
      }


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, one expected: the test function.");
      } else if (args.length == 1) {
        fn = args[0];
        opts = {};
      } else if (args.length >= 2) {
        opts = args[0];fn = args[1];
      }

      if (typeof opts == "string") opts = { name: opts };
      if (!opts.name) opts.name = "anonymous test";


      task = new _Test2.default(opts, this.simple({ name: "test function", title: "Test function" }, fn));


      wrapper = function wrapper() {for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {args[_key11] = arguments[_key11];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this9.runTest(task, opts, params);
      };

      this.initTestWrapper(wrapper, task);


      this.stack.top.add(wrapper);


      return wrapper;
    } }, { key: "runTest", value: function runTest(






    test, opts, params) {
      var title, res;


      title = opts.title || test.title;

      if (!opts.hasOwnProperty("mute")) opts.mute = test.mute;


      if (opts.ignore || test.ignore) {
        if (!opts.mute) this.reporters.ignore(title, test);
      } else {
        var oo = {};
        if (opts.mute) oo.mute = true;

        if (test.hasParams()) {var _iteratorNormalCompletion13 = true;var _didIteratorError13 = false;var _iteratorError13 = undefined;try {
            for (var _iterator13 = test.params[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {var _params = _step13.value;
              var headline = title + " # " + ((typeof _params === "undefined" ? "undefined" : _typeof(_params)) == "object" ? JSON.stringify(_params) : _params);


              if (!opts.mute) this.reporters.start(headline, test);var _iteratorNormalCompletion14 = true;var _didIteratorError14 = false;var _iteratorError14 = undefined;try {

                for (var _iterator14 = test.initializers[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {var _init2 = _step14.value;_init2.apply(undefined, [oo].concat([_params]));}} catch (err) {_didIteratorError14 = true;_iteratorError14 = err;} finally {try {if (!_iteratorNormalCompletion14 && _iterator14.return) {_iterator14.return();}} finally {if (_didIteratorError14) {throw _iteratorError14;}}}
              test.fn.apply(test, [oo].concat([_params]));var _iteratorNormalCompletion15 = true;var _didIteratorError15 = false;var _iteratorError15 = undefined;try {
                for (var _iterator15 = test.finalizers[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {var _fin2 = _step15.value;_fin2.apply(undefined, [oo].concat([_params]));}} catch (err) {_didIteratorError15 = true;_iteratorError15 = err;} finally {try {if (!_iteratorNormalCompletion15 && _iterator15.return) {_iterator15.return();}} finally {if (_didIteratorError15) {throw _iteratorError15;}}}

              if (!opts.mute) this.reporters.end(test);
            }} catch (err) {_didIteratorError13 = true;_iteratorError13 = err;} finally {try {if (!_iteratorNormalCompletion13 && _iterator13.return) {_iterator13.return();}} finally {if (_didIteratorError13) {throw _iteratorError13;}}}
        } else {

          if (!opts.mute) this.reporters.start(title, test);var _iteratorNormalCompletion16 = true;var _didIteratorError16 = false;var _iteratorError16 = undefined;try {

            for (var _iterator16 = test.initializers[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {var _init3 = _step16.value;_init3.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError16 = true;_iteratorError16 = err;} finally {try {if (!_iteratorNormalCompletion16 && _iterator16.return) {_iterator16.return();}} finally {if (_didIteratorError16) {throw _iteratorError16;}}}
          test.fn.apply(test, [oo].concat(_toConsumableArray(params)));var _iteratorNormalCompletion17 = true;var _didIteratorError17 = false;var _iteratorError17 = undefined;try {
            for (var _iterator17 = test.finalizers[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {var _fin3 = _step17.value;_fin3.apply(undefined, [oo].concat(_toConsumableArray(params)));}} catch (err) {_didIteratorError17 = true;_iteratorError17 = err;} finally {try {if (!_iteratorNormalCompletion17 && _iterator17.return) {_iterator17.return();}} finally {if (_didIteratorError17) {throw _iteratorError17;}}}

          if (!opts.mute) this.reporters.end(test);
        }
      }
    } }, { key:


















    init, value: function value() {var _this10 = this;for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {args[_key12] = arguments[_key12];}
      var opts, fn, task, wrapper;


      if (this.stack.length === 0) {
        throw new Error("init() must be invoked into a suite.");
      }


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, one expected: the init function.");
      } else if (args.length == 1) {
        fn = args[0];
        opts = { name: "__suite__" };
      } else if (args.length >= 2) {
        opts = args[0];fn = args[1];
      }

      if (typeof opts == "string") opts = { name: opts };
      if (!opts.name) opts.name = "__suite__";


      task = new _Initializer2.default(opts, fn);


      wrapper = function wrapper() {for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {args[_key13] = arguments[_key13];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this10.runInit(task, opts, params);
      };

      this.initWrapper(wrapper, task);


      this.stack.top.add(wrapper);


      return wrapper;
    } }, { key: "runInit", value: function runInit(






    task, opts, params) {
      return this.runSimpleTask(task, opts, params);
    } }, { key:


















    fin, value: function value() {var _this11 = this;for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {args[_key14] = arguments[_key14];}
      var opts, fn, task, wrapper;


      if (this.stack.length === 0) {
        throw new Error("fin() must be invoked into a suite.");
      }


      if (args.length === 0) {
        throw new Error("Invalid number of arguments. At least, one expected: the fin function.");
      } else if (args.length == 1) {
        fn = args[0];
        opts = { name: "__suite__" };
      } else if (args.length >= 2) {
        opts = args[0];fn = args[1];
      }

      if (typeof opts == "string") opts = { name: opts };
      if (!opts.name) opts.name = "__suite__";


      task = new _Finalizer2.default(opts, fn);


      wrapper = function wrapper() {for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {args[_key15] = arguments[_key15];}
        var opts, params;


        if (args.length === 0) {
          opts = {};
          params = [];
        } else if (args.length == 1) {
          opts = args[0];
          params = [];
        } else if (args.length >= 2) {
          opts = args[0];
          params = args.slice(1);
        }

        if (typeof opts == "string") opts = { title: opts };


        return _this11.runFin(task, opts, params);
      };

      this.initWrapper(wrapper, task);


      this.stack.top.add(wrapper);


      return wrapper;
    } }, { key: "runFin", value: function runFin(






    task, opts, params) {
      return this.runSimpleTask(task, opts, params);
    } }, { key: "initWrapper", value: function initWrapper(








    wrapper, task) {
      Object.defineProperty(wrapper, "__task__", { value: task });

      Object.defineProperty(wrapper, "ignore", {
        value: function value(opts) {for (var _len16 = arguments.length, params = Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {params[_key16 - 1] = arguments[_key16];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { ignore: true })].concat(params));
        },
        enumerable: true });


      Object.defineProperty(wrapper, "mute", {
        value: function value(opts) {for (var _len17 = arguments.length, params = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {params[_key17 - 1] = arguments[_key17];}
          if (typeof opts == "string") opts = { title: opts };
          return wrapper.apply(undefined, [Object.assign({}, opts, { mute: true })].concat(params));
        },
        enumerable: true });


      Object.defineProperty(wrapper, "title", {
        value: function value(title) {
          wrapper.__task__._title = title;
          return wrapper;
        },
        enumerable: true });

    } }, { key: "initTestWrapper", value: function initTestWrapper(








    wrapper, task) {
      this.initWrapper(wrapper, task);

      Object.defineProperty(wrapper, "only", {
        value: function value(opts) {for (var _len18 = arguments.length, params = Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {params[_key18 - 1] = arguments[_key18];}
          if (typeof opts == "string") opts = { title: opts };
          wrapper.apply(undefined, [Object.assign({}, opts, { only: true })].concat(params));
        },
        enumerable: true });


      Object.defineProperty(wrapper, "params", {
        value: function value() {for (var _len19 = arguments.length, params = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {params[_key19] = arguments[_key19];}
          wrapper.__task__.params = params;
          return wrapper;
        },
        enumerable: true });

    } }, { key: "end", value: function end()




    {
      this.reporters.end();
    } }, { key: "continueOnError", get: function get() {return !this.breakOnError;} }, { key: "state", get: function get() {var res;var _iteratorNormalCompletion18 = true;var _didIteratorError18 = false;var _iteratorError18 = undefined;try {for (var _iterator18 = this.reporters.items[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {var rep = _step18.value;if (rep.name == "state") res = rep.state;}} catch (err) {_didIteratorError18 = true;_iteratorError18 = err;} finally {try {if (!_iteratorNormalCompletion18 && _iterator18.return) {_iterator18.return();}} finally {if (_didIteratorError18) {throw _iteratorError18;}}}return res;} }], [{ key: "DEFAULT_DISPLAY", get: function get()

    {
      return DEFAULT_DISPLAY;
    } }]);return Runner;}();exports.default = Runner;
