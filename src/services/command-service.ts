import { commands, Disposable } from 'vscode';
import { ActionCommand, ContextCommand } from "../models/constants";

export class CommandService {
  registerCommand(command: ActionCommand, callback: (...args: any[]) => any, context: any): Disposable {
    return commands.registerCommand(command, callback, context);
  }

  async setContext(command: ContextCommand, value: boolean): Promise<void> {
    await commands.executeCommand('setContext', command, value);
  }
}
