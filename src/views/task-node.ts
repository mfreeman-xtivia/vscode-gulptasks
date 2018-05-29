import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ExplorerNodeType } from '../models/constants';
import { ExplorerNode } from './explorer-node';

export class TaskNode extends ExplorerNode {

  constructor(id: string, public readonly name: string) {
    super(id, ExplorerNodeType.Task);
  }

  async getTreeItem(): Promise<TreeItem> {
    return await this.treeItem(this.name, TreeItemCollapsibleState.None);
  }

  async getChildren(): Promise<ExplorerNode[]> {
    return await [];
  }
}
