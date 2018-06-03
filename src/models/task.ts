import { ChildProcess } from "child_process";

type ErrorCallback = (err?: Error) => void;

export class Task {

  private process: ChildProcess;

  constructor(private readonly factory: (callback: ErrorCallback) => ChildProcess, private readonly callback: (data: any) => void) { }

  execute(): Promise<void> {

    // Resolve immediately if a process already exists
    if (this.process) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {

      // Create a process and listen for the events to resolve the promise
      this.process = this.factory(err => err ? reject() : resolve());

      this.process.stdout.on('data', this.callback);
      this.process.stderr.on('data', this.callback);
    });
  }

  terminate(): Promise<void> {

    // Check a process is active
    const process: any = this.process;

    if (!process || process.exitCode) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {

      // Listen for the exit command to resolve the promise
      this.process.on('exit', () => {
        resolve();
      });

      // Kill the process to invoke the exit
      this.process.kill();
    });
  }
}
