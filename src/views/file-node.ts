import { TreeItemCollapsibleState } from 'vscode';
import { ExplorerNodeType } from '../models/constants';
import { File } from '../models/file';
import { ExplorerNode } from './explorer-node';
import { TaskNode } from './task-node';

export class FileNode extends ExplorerNode {

  constructor(id: string, public readonly file: File, private readonly tasks: TaskNode[]) {
    super(id, ExplorerNodeType.File, file.relativePath, TreeItemCollapsibleState.Expanded);

    // Assign the gulp icon
    this.iconPath = this.icon('gulp');
  }

  async children(): Promise<ExplorerNode[]> {
    return await this.tasks;
  }
}
