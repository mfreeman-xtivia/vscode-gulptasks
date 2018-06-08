## 1.0.0
- Provides a new UI that supports multiple gulp files in a workspace.
- Added icons to indicate execution state of a task.
- Fixed process output for long running tasks (e.g. gulp.watch).
- Supports global and local installs of gulp.
- Includes workspace specific environmental variables for gulp processes.

## 0.0.13
- Added terminal execution and 'runInTerminal' setting (defaults to false).

## 0.0.12
- Updated readme to remove global gulp install comment (no code changes).

## 0.0.11
- Changed gulp install discovery to include project 'node_modules/.bin' path.

## 0.0.10
- Changed file searching to be case insensitive.

## 0.0.9
- Added a config option to specify an exact gulp file to load.
- Added output message when loading of gulp tasks fails.
- Added restart button to start/stop long running tasks in one action.
- Refined navigation icons.

## 0.0.8
- Added wildcard discovery for gulpfile.js (e.g. gulpfile.babel.js).

## 0.0.7
- Added configuration to specify discovery directory.
- Added configuration to exclude directories during discovery (e.g. node_modules).

## 0.0.6
- Added exclusion for discovery in 'bower_components' folder.
- Improved discovery efficiency by returning immediately if a gulpfile.js is found in the workspace root.

## 0.0.5
- Another publish after last was a disaster....apologies for any issues, seems my noob status got in the way.

## 0.0.4
- Added gulp messages to output window
- Updated discovery of gulpfile.js to include workspace child folders

## 0.0.3
- Added better displaying of process output messages
- Added support to terminate long running tasks (i.e. gulp.watch)

## 0.0.2
- Changes needed for publishing (no functional changes)

## 0.0.1
- Initial release
