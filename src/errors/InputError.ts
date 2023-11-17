export class InputError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 400,
    public innerError?: Error) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = (<any>this).constructor.name;

    this.code = code;
    this.status = status;
    this.innerError = innerError;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}
