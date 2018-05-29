import { window } from 'vscode';
import { EXTENSION_NAME } from '../models/constants';

export class OutputLogger {
  private channel = window.createOutputChannel(EXTENSION_NAME);

  log(message: string): void  {
    this.channel.appendLine(message);
  }
}
