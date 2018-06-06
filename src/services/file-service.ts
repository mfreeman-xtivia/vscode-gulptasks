import { workspace } from 'vscode';
import { match } from 'minimatch';
import { Settings } from '../models/settings';
import { File } from '../models/file';

export class FileService {

  private _settings: Settings;

  constructor(private readonly settings: () => Settings) { }

  discoverGulpFiles(): Promise<File[]> {

    // Load the settings on demand to ensure the latest values are available
    this._settings = this.settings();

    return new Promise<File[]>((resolve, reject) => {

      // Use findFiles() in the workspace to get a list of potential files
      // Unfortunately, this is case sensitive so we need everything to filter manually
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
            .filter(file => this.shouldInclude(file));

          resolve(files);
        },
        err => reject(err));
    });
  }

  private isMatch(file: File, pattern: string): boolean {

    // Match the file's relative path
    const result = match([file.relativePath], pattern, {
      nocase: true,
      matchBase: true
    });

    // A non-empty result means a match has been found
    return result.length !== 0;
  }

  private shouldInclude(file: File): boolean {

    // First check the pattern is valid for the file
    if (!this.isMatch(file, this._settings.pattern)) {
      return false;
    }

    // Then check against the filters
    for (const filter of this._settings.filters) {
      if (!this.isMatch(file, filter)) {
        return false;
      }
    }

    return true;
  }
}
