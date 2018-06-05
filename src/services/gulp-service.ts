import { workspace } from 'vscode';
import { join } from 'path';
import { File } from '../models/file';
import { Task } from '../models/task';
import { ProcessService } from './process-service';

export class GulpService {

  constructor(public readonly versions: string[], private readonly root: string, private readonly processes: ProcessService) { }

  createTask(name: string, file: File, logger: (output: string) => void): Task {
    return new Task(callback => {

      // Create a process instance
      const proc = this.processes.createProcess([name, `--gulpfile "${file.absolutePath}"`], this.root, data => {

        // Convert the data to a set of lines
        const value = data.toString();
        const lines = GulpService.sanitizeResult(value);

        if (logger) {

          // Feed each line to the logger function
          for (const line of lines) {
            logger(line);
          }
        }
      });

      // Then execute and handle the result
      callback = callback || (() => {});

      proc
        .execute()
        .then(() => callback())
        .catch(err => callback(err));

      // Return the terminate function for later invocation
      return proc.terminate;
    });
  }

  getFileTasks(file: File): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {

      // Load and return the tasks for the provided file
      this.processes
        .createProcess(['--tasks-simple', `--gulpfile "${file.absolutePath}"`], this.root)
        .execute()
        .then(result => {
          const tasks = GulpService.sanitizeResult(result);
          resolve(tasks);
        })
        .catch(err => reject(err.message || err));
    });
  }

  static resolveInstall(processes: ProcessService): Promise<GulpService> {
    return new Promise<GulpService>((resolve, reject) => {

      // First attempt to resolve a global installation
      processes
        .createProcess(['--version'], workspace.rootPath)
        .execute()
        .then(result => this.processResult(result, workspace.rootPath, processes, resolve))
        .catch(() => {

          // Then check if a local install is available (i.e. in node_modules)
          const local = join(workspace.rootPath, 'node_modules/.bin');

          processes
            .createProcess(['--version'], local)
            .execute()
            .then(result => this.processResult(result, local, processes, resolve))
            .catch(err => reject(err.message || err));
        });
    });
  }

  private static processResult(result: string, root: string, processes: ProcessService, resolve: (gulp: GulpService) => void): void {
    const versions = this.sanitizeResult(result);
    const gulp = new GulpService(versions, root, processes);

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
}
