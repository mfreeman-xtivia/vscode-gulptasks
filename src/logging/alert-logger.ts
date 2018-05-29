import { window } from 'vscode';

export class AlertLogger {
  info(message: string): void {
    window.showInformationMessage(message);
  }

  warn(message: string): void {
    window.showWarningMessage(message);
  }

  error(message: string): void {
    window.showErrorMessage(message);
  }
}
