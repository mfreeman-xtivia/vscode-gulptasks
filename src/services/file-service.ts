import { workspace } from 'vscode';
import { match } from 'minimatch';
import { File } from '../models/file';
import { Settings } from '../models/settings';

export class FileService {

  constructor(private readonly settings: Settings) { }

  discover(): Promise<File[]> {
    return new Promise<File[]>((resolve, reject) => {

      // Use findFiles() in the workspace to get a list of potential files
      // Unfortunately, this is not case in sensitive so we need everything to filter manually
      workspace
        .findFiles('**/*')
        .then(uris => {

          // Convert and filter the results based on the filters setting
          const files = uris
            .map(uri => {
              return {
                relativePath: workspace.asRelativePath(uri),
                absolutePath: uri.fsPath
              };
            })
            .filter(file => this.include(file));

          resolve(files);
        },
        err => reject(err.message || err));
    });
  }

  private include(file: File): boolean {

    // First check the pattern is valid for the file
    if (!this.matched(file, this.settings.pattern)) {
      return false;
    }

    // Then check against the filters
    for (const filter of this.settings.filters) {
      if (!this.matched(file, filter)) {
        return false;
      }
    }

    return true;
  }

  private matched(file: File, pattern: string): boolean {

    // Match the file's relative path
    const result = match([file.relativePath], pattern, {
      nocase: true,
      matchBase: true
    });

    // a non-empty result means a match has been found
    return result.length !== 0;
  }
}
