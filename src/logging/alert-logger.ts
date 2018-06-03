import { window } from 'vscode';
import { EXTENSION_NAME } from '../models/constants';

export class AlertLogger {
  info(message: string): void {
    window.showInformationMessage(`${EXTENSION_NAME}: ${message}`);
  }

  warn(message: string): void {
    window.showWarningMessage(`${EXTENSION_NAME}: ${message}`);
  }

  error(message: string): void {
    window.showErrorMessage(`${EXTENSION_NAME}: ${message}`);
  }
}
