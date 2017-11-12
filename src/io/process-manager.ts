import { ExecOptions } from 'child_process';
import { exec } from 'child_process';

export class ProcessManager {

  constructor (private readonly _workingDirectory: string) { }

  async getGulpVersion(): Promise<string> {
    return await this.exec('gulp -v', {
      cwd: this._workingDirectory
    });
  }

  private exec(command: string, options: ExecOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        }

        resolve(stdout);
      });
    });
  }
}
