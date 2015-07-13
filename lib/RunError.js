/**
 * Base for the errors throwing by the runner.
 *
 * @param item:Item     The item throwing the error.
 * @param error:object  The error thrown.
 */
export class RunError extends Error {
  /**
   * Constructor.
   *
   * @param(attr) item
   * @param(attr) error
   */
  constructor(item, error) {
    super({message: error.toString()});
    
    Object.defineProperty(this, "item", {value: item, enumerable: true});
    Object.defineProperty(this, "error", {value: error, enumerable: true});
  }
}
