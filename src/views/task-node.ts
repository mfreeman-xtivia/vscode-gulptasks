import { TreeItemCollapsibleState } from 'vscode';
import { ExplorerNodeType, ActionCommand } from '../models/constants';
import { ExplorerNode } from './explorer-node';

export class TaskNode extends ExplorerNode {

  private _executing = false;

  get executing(): boolean {
    return this._executing;
  }
  set executing(value: boolean) {
    this._executing = value;

    // Update the node based on the changed state
    this.update();
  }

  constructor(id: string, public readonly name: string) {
    super(id, ExplorerNodeType.Task, name, TreeItemCollapsibleState.None);

    // Define a command that is triggered when the node is selected
    this.command = {
      title: name,
      command: ActionCommand.Select,
      arguments: [this]
    };

    // Update the node to apply default behaviour
    this.update();
  }

  async children(): Promise<ExplorerNode[]> {
    return [];
  }

  private update(): void {
    if (this._executing) {
      this.iconPath = this.iconTheme('execute');
    } else {
      this.iconPath = this.iconTheme('idle');
    }
  }
}
