import { TreeItemCollapsibleState } from 'vscode';
import { join } from 'path';
import { ExplorerNodeType } from '../models/constants';
import { ExplorerNode } from './explorer-node';

export class TaskNode extends ExplorerNode {

  private executing = false;

  constructor(id: string, public readonly name: string) {
    super(id, ExplorerNodeType.Task, name, TreeItemCollapsibleState.None);
  }

  async getChildren(): Promise<ExplorerNode[]> {
    return [];
  }

  setExecuting(executing: boolean): void {

    // Set the executing state and assign the executing icon if true
    this.executing = executing;

    if (this.executing) {
      this.iconPath = {
        light: join(__filename, '..', '..', '..', 'resources', 'light', `executing.svg`),
        dark: join(__filename, '..', '..', '..', 'resources', 'dark', `executing.svg`)
      };
    }
  }
}
