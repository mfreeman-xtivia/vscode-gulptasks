import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { join } from 'path';
import { EXTENSION_ID } from '../models/constants';
import { ExplorerNodeType } from '../models/constants';

export abstract class ExplorerNode extends TreeItem {

  constructor(id: string, type: ExplorerNodeType, label: string, collapsibleState: TreeItemCollapsibleState) {
    super(label, collapsibleState);

    this.id = id;
    this.contextValue = `${EXTENSION_ID}:${type}`;
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
