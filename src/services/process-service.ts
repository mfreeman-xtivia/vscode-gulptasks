import { exec } from 'child_process';
import { Settings } from '../models/settings';
import { Process } from '../models/process';

export class ProcessService {

  constructor(private readonly settings: Settings) { }

  createProcess(args: any[], workingDirectory: string, callback?: (data: string) => void): Process {

    // Check if a terminal is required
    if (this.settings.runInTerminal) {
      return undefined;
    }

    // Otherwise spin up a child process
    return this.createChildProcess(args, workingDirectory, callback);
  }

  private createChildProcess(args: any[], workingDirectory: string, callback?: (data: string) => void): Process {
    let proc;

    return new Process(
      () => new Promise<string>((resolve, reject) => {
        try {

          // Don't allow the process to be recreated
          if (proc) {
            return Promise.resolve();
          }

          // Attempt to invoke the command
          proc = exec(`gulp ${args.join(' ')}`, { cwd: workingDirectory }, (error, stdout) => {

            // Clear the proc variable as it has now completed
            proc = undefined;

            // Resolve or reject depending on how the process finishes
            if (error) {
              reject(error);
            } else {
              resolve(stdout);
            }
          });

          // Track the process output in real time
          if (callback) {
            proc.stdout.on('data', callback);
            proc.stderr.on('data', callback);
          }
        }
        catch (ex) {

          // Catch all reject handler
          reject(ex);
        }
      }),
      () => {

        // Check a process is active
        if (!proc || proc.exitCode) {
          return Promise.resolve();
        }

        return new Promise<void>(resolve => {

          // Kill the process to invoke the exit
          // Listen for the exit event to resolve the promise
          proc.on('exit', () => resolve());
          proc.kill();
        });
      }
    );
  }
}
