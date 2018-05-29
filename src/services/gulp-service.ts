import { workspace } from 'vscode';
import { join } from 'path';
import { ExecOptions } from 'child_process';
import { exec } from 'child_process'
import { File } from '../models/file';
import { Logger } from '../logging/logger';

export class GulpService {

  constructor(public readonly versions: string[], private readonly root: string) { }

  // create(name: string, file: File, logger: Logger): () => void {
  //   return () => {
  //     const process = exec(`gulp ${name} --gulpfile "${file.absolutePath}"`, { cwd: this.root });

  //     process.stdout.on('data', data => {
  //       const value = data.toString();
  //       const lines = GulpService.sanitize(value);

  //       if (lines.length > 0) {
  //         logger.output.log(`> ${name}: ${lines.join('\r\n> ')}`);
  //       }
  //     });
  //   };
  // }

  // tasks(file: File): Promise<string[]> {
  //   return new Promise<string[]>((resolve, reject) => {

  //     // Load and return the tasks for the provided file
  //     GulpService
  //       .invoke(`gulp --tasks-simple --gulpfile "${file.absolutePath}"`, { cwd: this.root })
  //       .then(result => {
  //         const tasks = GulpService.sanitize(result);
  //         resolve(tasks);
  //       })
  //       .catch(err => reject(err.message || err));
  //   });
  // }

  static init(): Promise<GulpService> {
    return new Promise<GulpService>((resolve, reject) => {

      // First attempt to resolve a global installation
      const command = 'gulp --version';

      this
        .invoke(command, { cwd: workspace.rootPath })
        .then(result => this.processResult(result, workspace.rootPath, resolve))
        .catch(() => {

          // Then check if a local install is available (i.e. in node_modules)
          const local = join(workspace.rootPath, 'node_modules/.bin');

          this
            .invoke(command, { cwd: local })
            .then(result => this.processResult(result, local, resolve))
            .catch(err => reject(err.message || err));
        });
    });
  }

  private static sanitize(lines: string): string[] {
    return lines
      .split(/\r{0,1}\n/)
      .map(line => {
        if (line.substr(0, 1) === '[') {
          const end = line.indexOf(']');

          if (end > -1) {
            line = line.substr(end + 1);
          }
        }

        return line.replace(/^\s+|\s+$/g, '');
      })
      .filter(line => line !== '');
  }

  private static processResult(result: string, root: string, resolve: (gulp: GulpService) => void): void {
    const versions = this.sanitize(result);
    const gulp = new GulpService(versions, root);

    resolve(gulp);
  }

  private static invoke(command: string, options?: ExecOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {

        // Attempt to invoke the command
        exec(command, options || {}, (error, stdout, stderr) => {

          // Either resolve or reject based on the error state
          if (error) {
            reject(stderr);
          }

          resolve(stdout);
        });
      }
      catch (ex) {

        // Reject if an error occurs
        reject(ex);
        debugger;
      }
    });
  }
}
