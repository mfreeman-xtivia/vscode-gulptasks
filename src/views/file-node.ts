import { TreeItemCollapsibleState } from 'vscode';
import { join } from 'path';
import { ExplorerNodeType } from '../models/constants';
import { File } from '../models/file';
import { ExplorerNode } from './explorer-node';
import { TaskNode } from './task-node';

export class FileNode extends ExplorerNode {

  constructor(id: string, public readonly file: File, private readonly tasks: TaskNode[]) {
    super(id, ExplorerNodeType.File, file.relativePath, TreeItemCollapsibleState.Expanded);

    this.iconPath = {
      light: join(__filename, '..', '..', '..', 'resources', 'light', `gulp.svg`),
      dark: join(__filename, '..', '..', '..', 'resources', 'dark', `gulp.svg`)
    };
  }

  async getChildren(): Promise<ExplorerNode[]> {
    return await this.tasks;
  }
}
