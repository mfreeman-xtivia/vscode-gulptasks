import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export abstract class ExplorerNode {

  constructor(private readonly _id: string) { }

  abstract getTreeItem(): Promise<TreeItem>;
  abstract getChildren(): Promise<ExplorerNode[]>;

  protected createTreeItem(label: string, collapsibleState: TreeItemCollapsibleState): TreeItem {
    const item = new TreeItem(label, collapsibleState);
    item.contextValue = `gulptasks:${this._id}`;

    return item;
  }
}
