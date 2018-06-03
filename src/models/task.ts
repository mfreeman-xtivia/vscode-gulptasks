import { Disposable } from 'vscode';
import { ChildProcess } from 'child_process';

type ErrorCallback = (err?: Error) => void;

export class Task implements Disposable {

  private process: ChildProcess;

  constructor(private readonly factory: (callback: ErrorCallback) => ChildProcess, private readonly callback: (data: any) => void) { }

  execute(): Promise<void> {

    // Resolve immediately if a process already exists or no factory defined
    if (this.process || !this.factory) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {

      // Create a process and listen for the events to resolve the promise
      // As well as handlers for the process output
      const callback = this.callback || (() => { });

      this.process = this.factory(err => err ? reject() : resolve());

      this.process.stdout.on('data', callback);
      this.process.stderr.on('data', callback);
    });
  }

  terminate(): Promise<void> {

    // Check a process is active
    const process: any = this.process;

    if (!process || process.exitCode) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {

      // Kill the process to invoke the exit
      // Listen for the exit command to resolve the promise
      this.process.on('exit', () => resolve());
      this.process.kill();
    });
  }

  dispose(): void {
    this.terminate();
  }
}
