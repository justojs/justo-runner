//imports
import CompositeTask from "./CompositeTask";

/**
 * A test workflow.
 */
export default class FileMacro extends CompositeTask {
  /**
   * Constructor.
   *
   * @param(attr) opts
   * @param config:object The config options: require (string or string[]),
   *                      src (string or string[]).
   */
  constructor(opts, config) {
    //(1) super
    super(opts);

    //(2) arguments
    config = Object.assign({}, config);

    if (!config.require) config.require = [];
    else if (typeof(config.require) == "string") config.require = [config.require];

    if (!config.src) config.src = [];
    else if (typeof(config.src) == "string") config.src = [config.src];

    //(3) init own members
    Object.defineProperty(this, "src", {value: config.src, enumerable: true});
    Object.defineProperty(this, "require", {value: config.require, enumerable: true});
  }
}
