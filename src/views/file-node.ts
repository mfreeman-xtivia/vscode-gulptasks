import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ExplorerNodeType } from '../models/constants';
import { File } from '../models/file';
import { ExplorerNode } from './explorer-node';
import { TaskNode } from './task-node';

export class FileNode extends ExplorerNode {

  constructor(id: string, public readonly file: File, private readonly tasks: TaskNode[]) {
    super(id, ExplorerNodeType.File);
  }

  async getTreeItem(): Promise<TreeItem> {
    return await this.treeItem(this.file.relativePath, TreeItemCollapsibleState.Expanded);
  }

  async getChildren(): Promise<ExplorerNode[]> {
    return await this.tasks;
  }
}
