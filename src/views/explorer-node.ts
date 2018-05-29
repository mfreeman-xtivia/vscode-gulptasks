import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { EXTENSION_ID } from '../models/constants';
import { ActionCommand, ExplorerNodeType } from '../models/constants';

export abstract class ExplorerNode {

  constructor(private readonly id: string, private readonly type: ExplorerNodeType) { }

  abstract getTreeItem(): Promise<TreeItem>;
  abstract getChildren(): Promise<ExplorerNode[]>;

  protected treeItem(label: string, collapsibleState: TreeItemCollapsibleState): TreeItem {
    const item = new TreeItem(label, collapsibleState);

    // item.id = this.id;
    // item.contextValue = `${EXTENSION_ID}:${this.type}`;
    // item.command = {
    //   title: '',
    //   command: ActionCommand.Select,
    //   arguments: [this.id, this.type]
    // };

    return item;
  }
}
