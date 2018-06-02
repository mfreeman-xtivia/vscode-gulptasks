import { Event, EventEmitter, TreeItem, TreeDataProvider, ProviderResult } from 'vscode';
import { ActionCommand, ContextCommand, ExplorerNodeType} from '../models/constants';
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

  private _onDidChangeTreeData = new EventEmitter<ExplorerNode>();

  get onDidChangeTreeData(): Event<ExplorerNode> {
    return this._onDidChangeTreeData.event;
  }

  constructor(private readonly gulp: GulpService, private readonly files: FileService, private readonly commands: CommandService, private readonly logger: Logger) {

    // Register handlers for the commands
    this.commands.registerCommand(ActionCommand.Select, this.selectTask, this);
    this.commands.registerCommand(ActionCommand.Execute, this.executeTask, this);
    this.commands.registerCommand(ActionCommand.Terminate, this.terminateTask, this);
    this.commands.registerCommand(ActionCommand.Restart, this.restartTask, this);
    this.commands.registerCommand(ActionCommand.Refresh, this.load, this);
  }

  getTreeItem(node: ExplorerNode): TreeItem {
    return node;
  }

  getChildren(node?: ExplorerNode): ProviderResult<ExplorerNode[]> {
    return node ? node.children() : this.root.children();
  }

  async load(): Promise<void> {
    this.logger.output.log('Loading gulp tasks...');

    try {
      this.root = await this.loadFiles();
      this.render();
    }
    catch (ex) {
      this.logger.error(ex.message || ex);
    }
  }

  private async loadFiles(): Promise<RootNode> {
    const nodes = [];
    const files = await this.files.discoverGulpFiles();

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
    const tasks = await this.gulp.getFileTasks(file);

    for (const task of tasks) {
      const id = `${fileId}:${task}`;
      const node = new TaskNode(id, task);

      nodes.push(node);
    }

    return nodes;
  }

  private selectTask(node: ExplorerNode): void {

    // Track the node if it is has a task type
    this.selected = node.type === ExplorerNodeType.Task
      ? node as TaskNode
      : undefined;

    this.render();
  }

  private executeTask(): void {
    if (this.selected) {
      this.selected.execute();
      this.render();
    }
  }

  private terminateTask(): void {
    if (this.selected) {
      this.selected.terminate();
      this.render();
    }
  }

  private restartTask(): void {
    this.terminateTask();
    this.executeTask();
  }

  private render(): void {

    // Need to resolve the selected task and hide/show the action icons
    let canExecute = false;
    let canTerminate = false;
    let canRestart = false;

    if (this.selected) {
      canExecute = !this.selected.executing;
      canTerminate = this.selected.executing;
      canRestart = this.selected.executing;
    }

    this.commands.setContext(ContextCommand.CanExecute, canExecute);
    this.commands.setContext(ContextCommand.CanTerminate, canTerminate);
    this.commands.setContext(ContextCommand.CanRestart, canRestart);

    this._onDidChangeTreeData.fire();
  }
}
