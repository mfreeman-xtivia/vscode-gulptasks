import { commands, Disposable } from 'vscode';
import { ContextCommand, ActionCommand } from "../models/constants";

export class CommandService {
  async context(command: ContextCommand, value: boolean): Promise<void> {
    await commands.executeCommand('setContext', command, value);
  }

  register(command: ActionCommand, callback: (...args: any[]) => any, context: any): Disposable {
    return commands.registerCommand(command, callback, context);
  }
}
