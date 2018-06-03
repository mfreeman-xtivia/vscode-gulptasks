import { ExtensionContext } from 'vscode';
import { workspace, window } from 'vscode';
import { EXTENSION_ID, EXPLORER_ID } from './models/constants';
import { ContextCommand } from './models/constants';
import { Settings } from './models/settings';
import { Logger } from './logging/logger';
import { GulpService } from './services/gulp-service';
import { FileService } from './services/file-service';
import { CommandService } from './services/command-service';
import { Explorer } from './views/explorer';

export function activate(context: ExtensionContext): void {
  const logger = new Logger();
  const commands = new CommandService();
  const config = workspace.getConfiguration()
  const settings = config.get<Settings>(EXTENSION_ID);

  context.subscriptions.push(logger);

  // Resolve a gulp service to be used (local or global)
  logger.output.log('Initializing gulp...')

  GulpService
    .resolveInstall()
    .then(async gulp => {
      const versions = gulp.versions.join('\r\n> ');
      logger.output.log(`> ${versions}`);

      // Load the explorer tree
      const files = new FileService(settings);
      const explorer = new Explorer(gulp, files, commands, logger);

      await explorer.load();

      // Register the explorer as a tree provider for disposing
      const provider = window.registerTreeDataProvider(EXPLORER_ID, explorer);

      context.subscriptions.push(explorer);
      context.subscriptions.push(provider);

      await commands.setContext(ContextCommand.Enabled, true);
    })
    .catch(async () => {
      logger.output.log(`> Unable to resolve gulp - try running 'npm i -g gulp'.`);
      await commands.setContext(ContextCommand.Enabled, false);
    });
}

export function deactivate(): void { }
