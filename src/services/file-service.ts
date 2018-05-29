import { workspace } from 'vscode';
import { match } from 'minimatch';
import { File } from '../models/file';
import { Settings } from '../models/settings';

export class FileService {

  constructor(private readonly settings: Settings) { }

  discover(): Promise<File[]> {
    return new Promise<File[]>((resolve, reject) => {

      // Use the workspace.findFiles() utility to discover any gulp files (based on the pattern setting)
      workspace
        .findFiles(this.settings.pattern)
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
    for (const filter of this.settings.filters) {

      // Match the file's relative path against the filter
      const result = match([file.relativePath], filter, {
        nocase: true,
        matchBase: true
      });

      // If nothing is returned, then the file is not included
      if (result.length === 0) {
        return false;
      }
    }

    return true;
  }
}
