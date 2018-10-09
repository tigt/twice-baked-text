const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');
const xmlToString = (new XMLSerializer).serializeToString;

module.exports = function mergeInkscapeChanges({ data, filename }) {
  const inkscapedFileData = fs.readFileSync(filename, 'utf8');
  console.log(inkscapedFileData)
  const inkscapedSvgDoc = (new DOMParser).parseFromString(inkscapedFileData);

  const newSvgText = Array.from(inkscapedSvgDoc.getElementsByTagName('g'))
    .filter(el => el.nextSibling && el.nextSibling.target === 'twice-bake-text')
    .map(modifyReplacement)
    .reduce(insertReplacements, data);

  console.log(`Writing data to ${filename}: ${newSvgText}`)
  fs.writeFileSync(filename, newSvgText);
};

const textStylesRx = /line-height|font|text|-baseline/i;
function modifyReplacement(replacement) {
  replacement.setAttribute('class', options.replacementClass);
  replacement.setAttribute('aria-hidden', 'true');
  replacement.removeAttribute('aria-label'); // we include the original text, so

  removeTextStyles(replacement);
  replacement.getElementsByTagName('*').forEach(removeTextStyles);

  return replacement;
}

function removeTextStyles(el) {
  const styles = el.getAttribute('style').split(';');
  const relevantStyles = styles.filter(style => ! textStylesRx.test(style));
  replacement.setAttribute('style', relevantStyles.join(';'));
}

function modifyOriginalText(text) {
  text.setAttribute('opacity', 0);
}

function insertReplacements(svgText, replacement) {
  return svgText.replace(
    `<?twice-bake-text ${replacement.nextSibling.data}?>`,
    `${xmlToString(replacement)}\n`
  );
}
