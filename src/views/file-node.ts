import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { FileInfo } from '../io/file-info';
import { ProcessManager } from '../io/process-manager';
import { ExplorerNode } from './explorer-node';
import { TaskNode } from './task-node';

export class FileNode extends ExplorerNode {

  constructor(private readonly _fileInfo: FileInfo, private readonly _processManager: ProcessManager) {
    super('file');
  }

  async getTreeItem(): Promise<TreeItem> {
    return this.createTreeItem(this._fileInfo.relativePath, TreeItemCollapsibleState.Expanded);
  }

  async getChildren(): Promise<ExplorerNode[]> {
    var tasks = await this._processManager.getGulpTasks(this._fileInfo);

    return tasks.map(() => new TaskNode());
  }
}
