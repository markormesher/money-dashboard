type ErrorReceiver = (message: string, error?: Error) => unknown;

class ErrorManager {
  private fatalErrorRecevivers: ErrorReceiver[] = [];
  private nonFatalErrorRecevivers: ErrorReceiver[] = [];

  public addFatalErrorReceiver(errorReceviver: ErrorReceiver) {
    this.fatalErrorRecevivers.push(errorReceviver);
  }

  public addNonFatalErrorReceiver(errorReceviver: ErrorReceiver) {
    this.nonFatalErrorRecevivers.push(errorReceviver);
  }

  public emitFatalError(message: string, error?: Error): void {
    this.fatalErrorRecevivers.forEach((receiver) => receiver?.(message, error));
  }

  public emitNonFatalError(message: string, error?: Error): void {
    this.nonFatalErrorRecevivers.forEach((receiver) => receiver?.(message, error));
  }
}

// singleton instance
const globalErrorManager = new ErrorManager();

export { globalErrorManager };
