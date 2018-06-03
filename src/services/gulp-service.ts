import { workspace } from 'vscode';
import { join } from 'path';
import { ExecOptions } from 'child_process';
import { exec } from 'child_process'
import { File } from '../models/file';
import { Task } from '../models/task';

export class GulpService {

  constructor(public readonly versions: string[], private readonly root: string) { }

  createTask(name: string, file: File, logger: (lines: string[]) => void): Task {
    return new Task(
      callback => {

        // Create the task process and bind the callback to return any errors
        return exec(`gulp ${name} --gulpfile "${file.absolutePath}"`, { cwd: this.root }, err => {
          if (callback) {
            callback(err);
          }
        });
      },
      data => {

        // Convert the data to a set of lines
        const value = data.toString();
        const lines = GulpService.sanitizeResult(value);

        if (logger && lines.length > 0) {
          logger(lines);
        }
      });
  }

  getFileTasks(file: File): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {

      // Load and return the tasks for the provided file
      GulpService
        .invokeCommand(`gulp --tasks-simple --gulpfile "${file.absolutePath}"`, { cwd: this.root })
        .then(result => {
          const tasks = GulpService.sanitizeResult(result);
          resolve(tasks);
        })
        .catch(err => reject(err.message || err));
    });
  }

  static resolveInstall(): Promise<GulpService> {
    return new Promise<GulpService>((resolve, reject) => {

      // First attempt to resolve a global installation
      const command = 'gulp --version';

      this
        .invokeCommand(command, { cwd: workspace.rootPath })
        .then(result => this.processResult(result, workspace.rootPath, resolve))
        .catch(() => {

          // Then check if a local install is available (i.e. in node_modules)
          const local = join(workspace.rootPath, 'node_modules/.bin');

          this
            .invokeCommand(command, { cwd: local })
            .then(result => this.processResult(result, local, resolve))
            .catch(err => reject(err.message || err));
        });
    });
  }

  private static processResult(result: string, root: string, resolve: (gulp: GulpService) => void): void {
    const versions = this.sanitizeResult(result);
    const gulp = new GulpService(versions, root);

    resolve(gulp);
  }

  private static sanitizeResult(lines: string): string[] {
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

  private static invokeCommand(command: string, options?: ExecOptions): Promise<string> {
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
      }
    });
  }
}
