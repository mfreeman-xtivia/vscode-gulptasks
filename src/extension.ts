'use strict';

import { ExtensionContext } from 'vscode';
import { workspace, window } from 'vscode';
import { setCommandContext } from 'vscode';
import { ProcessManager } from './io/process-manager';
import { FileSystem } from './io/file-system';
import { Explorer } from './views/explorer';

export async function activate(context: ExtensionContext): void {
  const processManager = new ProcessManager();
  const fileSystem = new FileSystem(workspace.rootPath);
  const explorer = new Explorer(context, processManager, fileSystem);
  const provider = window.registerTreeDataProvider('gulptasks:explorer:tree', explorer);

  try {

    // Attempt to get the gulp version as a test for it availability
    await processManager.getGulpVersion();
  }
  catch (ex) {
      Logger.error(ex, 'Extension.activate');
      if (ex.message.includes('Unable to find git')) {
          await window.showErrorMessage(`GulpTasks was unable to find Git. Please make sure Git is installed. Also ensure that Git is either in the PATH, or that 'gitlens.advanced.git' is pointed to its installed location.`);
      }
      setCommandContext(CommandContext.Enabled, false);
      return;
  }

  context.subscriptions.push(provider);
}

export function deactivate(): void { }
