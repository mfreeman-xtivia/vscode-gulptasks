import { TreeItem, TreeItemCollapsibleState, Disposable } from 'vscode';
import { join } from 'path';
import { EXTENSION_ID } from '../models/constants';
import { ExplorerNodeType } from '../models/constants';
import { ActionCommand } from '../models/constants';

export abstract class ExplorerNode extends TreeItem implements Disposable {

  constructor(public readonly id: string, public readonly type: ExplorerNodeType, label: string, collapsibleState: TreeItemCollapsibleState) {
    super(label, collapsibleState);

    // Bind common setup for all explorer nodes
    this.contextValue = `${EXTENSION_ID}:${this.type}`;
    this.command = {
      title: label,
      command: ActionCommand.Select,
      arguments: [this]
    };
  }

  abstract children(): Promise<ExplorerNode[]>;
  abstract dispose(): void;

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
