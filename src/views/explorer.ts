'use strict';

import { ExtensionContext, Event, EventEmitter, TreeItem, TreeDataProvider, ProviderResult } from 'vscode';
import { ProcessManager } from '../io/process-manager';
import { FileSystem } from '../io/file-system';
import { ExplorerNode } from './explorer-node';
import { RootNode } from './root-node';

export class Explorer implements TreeDataProvider<ExplorerNode> {

  private _root: ExplorerNode;

  private _onDidChangeTreeData = new EventEmitter<ExplorerNode>();

  public get onDidChangeTreeData(): Event<ExplorerNode> {
    return this._onDidChangeTreeData.event;
  }

  constructor(context: ExtensionContext, processManager: ProcessManager, fileSystem: FileSystem) {
    this._root = new RootNode(processManager, fileSystem);
  }

  getTreeItem(node: ExplorerNode): TreeItem | Thenable<TreeItem> {
    return node.getTreeItem();
  }

  getChildren(node?: ExplorerNode): ProviderResult<ExplorerNode[]> {

    // If no parent node provided use the root (note that the root is never displayed)
    if (node === undefined) {
      return this._root.getChildren();
    }

    return node.getChildren();
  }
}
