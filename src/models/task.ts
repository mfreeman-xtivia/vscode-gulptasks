import { Disposable } from 'vscode';

type ErrorCallback = (err?: Error) => void;
type ProcessTerminator = () => Promise<void>;

export class Task implements Disposable {

  private terminator: ProcessTerminator;

  constructor(private readonly invoker: (callback: ErrorCallback) => ProcessTerminator) { }

  execute(): Promise<void> {

    // Resolve immediately if the task is already running or no invoker is defined
    if (this.terminator || !this.invoker) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {

      // Invoke the task process and resolve the promise appropriately
      // Track the process instance to terminate later
      this.terminator = this.invoker(err => err ? reject() : resolve());
    });
  }

  terminate(): Promise<void> {

    // If no process then resolve immediately
    if (!this.terminator) {
      return Promise.resolve();
    }

    // Otherwise invoke the process termination
    const promise = this.terminator();
    return promise.then(() => this.terminator = undefined);
  }

  dispose(): void {
    this.terminate();
  }
}
