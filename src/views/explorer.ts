import { Event, EventEmitter, TreeItem, TreeDataProvider, ProviderResult } from 'vscode';
import { ActionCommand, ContextCommand } from '../models/constants';
import { File } from '../models/file';
import { Logger } from '../logging/logger';
import { GulpService } from '../services/gulp-service';
import { FileService } from '../services/file-service';
import { CommandService } from '../services/command-service';
import { ExplorerNode } from './explorer-node';
import { RootNode } from './root-node';
import { FileNode } from './file-node';
import { TaskNode } from './task-node';

export class Explorer implements TreeDataProvider<ExplorerNode> {

  private selected: TaskNode;

  private root = new RootNode();
  private tasks: TaskNode[] = [];

  private _onDidChangeTreeData = new EventEmitter<ExplorerNode>();

  get onDidChangeTreeData(): Event<ExplorerNode> {
    return this._onDidChangeTreeData.event;
  }

  constructor(private readonly gulp: GulpService, private readonly files: FileService, private readonly commands: CommandService, private readonly logger: Logger) {

    // Register handlers for the commands
    this.commands.register(ActionCommand.Select, this.select, this);
    this.commands.register(ActionCommand.Execute, this.execute, this);
    this.commands.register(ActionCommand.Terminate, this.terminate, this);
    this.commands.register(ActionCommand.Restart, this.restart, this);
    this.commands.register(ActionCommand.Refresh, this.load, this);
  }

  getTreeItem(node: ExplorerNode): TreeItem {
    return node;
  }

  getChildren(node?: ExplorerNode): ProviderResult<ExplorerNode[]> {
    return node ? node.children() : this.root.children();
  }

  async load(): Promise<void> {
    try {
      await this.loadRoot()
    }
    catch (ex) {
      this.logger.error(ex.message || ex);
    }
  }

  private select(node: TaskNode): void {
    this.selected = node;
    this.setContext();
  }

  private execute(): void {
    if (this.selected) {
      this.selected.executing = true;
      this.setContext();
    }
  }

  private terminate(): void {
    if (this.selected) {
      this.selected.executing = false;
      this.setContext();
    }
  }

  private restart(): void {
    this.terminate();
    this.execute();
  }

  private setContext(): void {
    this.commands.context(ContextCommand.CanExecute, this.selected && !this.selected.executing);
    this.commands.context(ContextCommand.CanTerminate, this.selected && this.selected.executing);
    this.commands.context(ContextCommand.CanRestart, this.selected && this.selected.executing);

    this._onDidChangeTreeData.fire();
  }

  private async loadRoot(): Promise<void> {
    this.logger.output.log('Loading gulp tasks...');

    // Load the files and tasks into the container root node
    this.root = await this.loadFiles();

    // Fire the change event to reload the tree
    this._onDidChangeTreeData.fire();
  }

  private async loadFiles(): Promise<RootNode> {
    const nodes = [];
    const files = await this.files.discover();

    // Load the tasks for each discovered file
    for (const file of files) {
      const id = file.relativePath.replace(/\\/g, '-');
      const tasks = await this.loadTasks(id, file);
      const node = new FileNode(id, file, tasks);
      const taskNames = tasks.map(task => task.name);

      this.logger.output.log(`> ${file.relativePath} [${taskNames}]`);

      nodes.push(node);
    }

    return new RootNode(nodes);
  }

  private async loadTasks(fileId: string, file: File): Promise<TaskNode[]> {
    const nodes = [];
    const tasks = await this.gulp.tasks(file);

    for (const task of tasks) {
      const id = `${fileId}:${task}`;
      const node = new TaskNode(id, task);

      nodes.push(node);

      // Track the task node for later observations
      this.tasks.push(node);
    }

    return nodes;
  }
}
