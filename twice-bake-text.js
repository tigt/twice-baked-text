const fs = require('fs');
const path = require('path');
const defaultOptions = require('./settings');
const findSvgFiles = require('./lib/find-svg-files');
const SVG = require('./lib/svg');
const inkscapeConvert = require('./lib/inkscape-convert');

global.options = defaultOptions;

(function twiceBakeSvgText() {
  options.verbose && console.info('Starting twice-baked-svg-text…');

  const svgFiles = findSvgFiles(options.input);
  if (!svgFiles.length) {
    console.warn(`No SVGs found in ${options.input}`);
    return;
  } else {
    const num = svgFiles.length;
    console.info(`Found ${num} SVG file${num === 1 ? '' : 's'}`);
    options.verbose && console.dir(svgFiles);
  }

  options.verbose && console.info('Preparing files for Inkscape to convert…');
  const preppedSvgs = svgFiles.map(file => new SVG(file)).map(svg => {
    svg.prepForInkscape();
    svg.save(outputFilepath(svg.filepath));
    return svg;
  });

  options.verbose && console.info('Inkscape is converting <text> elements…');
  // Send entire array in so we pay Inkscape's startup cost only once
  const inkscapedSvgs = inkscapeConvert(preppedSvgs);

  options.verbose && console.info('Cleaning up Inkscape’s output…');
  const finalSvgs = inkscapedSvgs.map((_, i) => {
    const svg = preppedSvgs[i];
    svg.mergeReplacements();
    svg.save();
    return svg;
  });

  console.info(`<text> twice-baked into ${options.output}`);
})();

function outputFilepath(filepath) {
  return path.resolve(
    options.output,
    path.basename(filepath)
  );
}
