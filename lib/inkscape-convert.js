const path = require('path');
const shell = require('child_process');

module.exports = function inkscapeConvert(files) {
  const command = options.inkscapePath;
  let versionString;

  try {
    versionString = shell.execSync(`${command} -V`, {
      windowsHide: true
    }).toString();
  } catch(e) {
    console.error(`“${command}” wasn’t found from the command line. Is inkscape in your PATH?`);
  }

  const version = parseFloat(
    versionString.match(/Inkscape (\d+\.\d+)/)[1]
  );

  if (version < 0.92) {
    throw Error('twice-bake-text needs Inkscape version 0.92 or newer.');
  }

  const stdout = shell.execSync(`${command} --shell`, {
    input: files.map(buildInkscapeCommand).concat('quit\n').join('\n'),
    stdio: options.verbose ? null : 'ignore', // Inkscape complains a LOT
    windowsHide: true
  });

  return files;
};

function buildInkscapeCommand({ filepath }) {
  return `"${filepath}" -T --export-ignore-filters -l "${filepath}"`;
}
