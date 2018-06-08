import { ExtensionContext } from 'vscode';
import { workspace, window } from 'vscode';
import { EXTENSION_ID, EXPLORER_ID } from './models/constants';
import { ContextCommand } from './models/constants';
import { Logger } from './logging/logger';
import { GulpService } from './services/gulp-service';
import { FileService } from './services/file-service';
import { CommandService } from './services/command-service';
import { ProcessService } from './services/process-service';
import { Explorer } from './views/explorer';

interface LegacyConfig {
  file: string;
  runInTerminal: boolean;
  discovery: {
    dir: string;
    dirExclusions: string[];
  }
}

export function activate(context: ExtensionContext): void {

  // Check and notify if legacy settings might need manually migrating
  const logger = new Logger();
  const config = workspace.getConfiguration();
  const legacy = config.get<LegacyConfig>(EXTENSION_ID);

  if (legacy.file || legacy.discovery) {
    logger.alert.warn(`Some legacy settings have been detected that should be migrated.
      Only the 'gulptasks.pattern' and 'gulptasks.filters' settings should used - all others will removed in a future release.`);
  }

  context.subscriptions.push(logger);

  // Resolve a gulp service to be used (local or global)
  const commands = new CommandService();
  const processes = new ProcessService();

  logger.output.log('Initializing gulp...')

  GulpService
    .resolveInstall(processes)
    .then(async gulp => {
      const output = gulp.context.join('\r\n> ');
      logger.output.log(`> ${output}`);

      // Load the explorer tree
      const files = new FileService();
      const explorer = new Explorer(gulp, files, commands, logger);

      await explorer.load();

      // Register the explorer as a tree provider for disposing
      const provider = window.registerTreeDataProvider(EXPLORER_ID, explorer);

      context.subscriptions.push(explorer);
      context.subscriptions.push(provider);

      await commands.setContext(ContextCommand.Enabled, true);
    })
    .catch(async err => {
      const message = err
        ? err.message || err
        : `try running 'npm i -g gulp'`;

      logger.output.log(`Unable to resolve gulp - ${message}.`);
      await commands.setContext(ContextCommand.Enabled, false);
    });
}

export function deactivate(): void
{ }
