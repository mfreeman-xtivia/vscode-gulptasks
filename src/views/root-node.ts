import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { ProcessManager } from '../io/process-manager';
import { FileSystem } from '../io/file-system';
import { ExplorerNode } from './explorer-node';
import { FileNode } from './file-node';

export class RootNode extends ExplorerNode {

  constructor(private readonly _processManager: ProcessManager, private readonly _fileSystem: FileSystem) {
    super('root');
  }

  async getTreeItem(): Promise<TreeItem> {
    return this.createTreeItem('Files', TreeItemCollapsibleState.Expanded);
  }

  async getChildren(): Promise<ExplorerNode[]> {

    // Load all instances of a gulpfile.js
    // However, ensure the dependency versions are excluded
    const files = await this._fileSystem.find('gulpfile.js', 'node_modules');

    // Load the children based on the returned files
    let children: ExplorerNode[] = [];

    if (files.length > 0) {
      children = files.map(file => new FileNode(file, this._processManager));

      // If only a single file is resolved, return it's children to only display the tasks
      if (children.length === 1) {
        const node = children[0];
        return node.getChildren();
      }
    }

    return children;
  }
}
