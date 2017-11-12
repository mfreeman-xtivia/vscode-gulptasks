import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ExplorerNode } from './explorer-node';

export class TaskNode extends ExplorerNode {

  constructor(private readonly _index: number) {
    super('task')
  }

  async getTreeItem(): Promise<TreeItem> {
    return this.createTreeItem(`Task ${this._index}`, TreeItemCollapsibleState.None);
  }

  async getChildren(): Promise<ExplorerNode[]> {
    return [];
  }
}
