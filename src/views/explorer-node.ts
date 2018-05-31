import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { EXTENSION_ID } from '../models/constants';
import { ActionCommand, ExplorerNodeType } from '../models/constants';

export abstract class ExplorerNode extends TreeItem {

  constructor(id: string, type: ExplorerNodeType, label: string, collapsibleState: TreeItemCollapsibleState) {
    super(label, collapsibleState);

    this.id = id;
    this.contextValue = `${EXTENSION_ID}:${type}`;
    this.command = {
      title: label,
      command: ActionCommand.Select,
      arguments: [id, type]
    };
  }

  abstract getChildren?(): Promise<ExplorerNode[]>;
}
