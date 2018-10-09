const fs = require('fs');
const path = require('path');

function findSvgFiles(folderPath) {
  try {
    return fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.svg'))
      .map(file => path.resolve(process.cwd(), folderPath, file));
  } catch(err) {
    console.error(`Couldn’t find the "${folderPath}" folder.`);
    throw err;
  }
}

module.exports = findSvgFiles;
