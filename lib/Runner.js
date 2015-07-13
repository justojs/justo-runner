/**
 * A runner.
 */
export class Runner {
  /**
   * Runs a function synchronously.
   * Returns an object with the result: time, milliseconds; and error, if failed.
   *
   * @param fn:function The function to run.
   * @param con:object  The run context.
   * @param opts:object The run options: params (object), timeout (number).
   *
   * @return object
   */
  runSync(fn, con, opts) {
    var args, start, end, error;

    //(1) run
    if (opts.params) args = inject({params: opts.params}, fn);
    else args = [];

    try {
      start = Date.now();
      fn.apply(con || fn, args);
    } catch (e) {
      error = e;
    } finally {
      end = Date.now();
    }

    //(2) return result
    return {time: end - start, error: error};
  }

  /**
   * Runs a function asynchronously.
   *
   * @param fn:function   The function to run.
   * @param con:object    The run context.
   * @param opts:object   The run options: params and timeout.
   * @param done:function The function to call: fn({time, error}).
   */
  runAsync(fn, con, opts, done) {
    var args, start, end, error;

    //(1) run
    args = inject(
      {
        params: opts.params,
        done: function(error) {
          end = Date.now();
          done({time: end - start, error: error});
        }
      },
      fn
    );

    try {
      start = Date.now();
      fn.apply(con || fn, args);
    } catch (e) {
      error = e;
      end = Date.now();
      done({time: end - start, error: error});
    }
  }
}
