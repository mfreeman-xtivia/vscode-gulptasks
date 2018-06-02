import { TreeItemCollapsibleState } from 'vscode';
import { ExplorerNodeType } from '../models/constants';
import { ExplorerNode } from './explorer-node';

export class TaskNode extends ExplorerNode {

  private _executing = false;

  get executing(): boolean {
    return this._executing;
  }

  constructor(id: string, public readonly name: string) {
    super(id, ExplorerNodeType.Task, name, TreeItemCollapsibleState.None);

    // Initialize the icon
    this.update(false);
  }

  async children(): Promise<ExplorerNode[]> {
    return [];
  }

  execute(): void {
    this.update(true);
  }

  terminate(): void {
    this.update(false);
  }

  private update(executing: boolean): void {
    this._executing = executing;

    // Update the icon based on the executing state
    this.iconPath = this.iconTheme(this.executing ? 'execute' : 'idle')
  }
}
