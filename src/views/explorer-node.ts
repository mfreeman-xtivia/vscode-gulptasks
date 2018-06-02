import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { join } from 'path';
import { EXTENSION_ID } from '../models/constants';
import { ExplorerNodeType } from '../models/constants';
import { ActionCommand } from '../models/constants';

export abstract class ExplorerNode extends TreeItem {

  constructor(public readonly id: string, public readonly type: ExplorerNodeType, label: string, collapsibleState: TreeItemCollapsibleState) {
    super(label, collapsibleState);

    this.contextValue = `${EXTENSION_ID}:${this.type}`;
    this.command = {
      title: label,
      command: ActionCommand.Select,
      arguments: [this]
    };
  }

  abstract children(): Promise<ExplorerNode[]>;

  protected icon(name: string): any {
    return join(__filename, '..', '..', '..', 'resources', 'icons', `${name}.svg`);
  }

  protected iconTheme(name: string): any {
    return {
      dark: this.icon(`${name}-dark`),
      light: this.icon(`${name}-light`)
    };
  }
}
