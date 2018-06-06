import { exec } from 'child_process';
import { Process } from '../models/process';

export class ProcessService {

  createProcess(root: string, args: any[], callback?: (data: string) => void): Process {
    let proc;

    return new Process(
      () => new Promise<string>((resolve, reject) => {
        try {

          // Don't allow the process to be recreated
          if (proc) {
            return Promise.resolve();
          }

          // Attempt to invoke the command
          const env = process.env;

          proc = exec(`gulp ${args.join(' ')}`, { cwd: root, env: env }, (err, stdout) => {

            // Clear the proc variable as it has now completed
            proc = undefined;

            // Resolve or reject depending on how the process finishes
            if (err) {
              reject(err);
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
        catch (err) {

          // Catch all reject handler
          reject(err);
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
