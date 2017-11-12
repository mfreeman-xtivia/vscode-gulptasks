import { FileInfo } from './file-info';

export class FileSystem {

  constructor(private readonly _rootPath: string) {}

  async find(pattern: string, ...exclusions: string[]): Promise<FileInfo[]> {
    return [
      {
        relativePath: 'gulpfile.js',
        absolutePath: 'gulpfile.js'
      }
    ];
  }
}
