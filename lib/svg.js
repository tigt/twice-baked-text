const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');

module.exports = SVG;

function SVG(filepath) {
  this.filepath = filepath;

  const filedata = fs.readFileSync(filepath, 'utf8');
  this.doc = (new DOMParser).parseFromString(filedata);
  this.texts = Array.from(this.doc.getElementsByTagName('text'));
}


SVG.prototype.toString = function svgToString() {
  return (new XMLSerializer).serializeToString(this.doc);
}


SVG.prototype.prepForInkscape = function prepSvgsForInkscape() {
  this.texts.forEach(markTextEl);
}

function markTextEl(textEl, i) {
  const marker = textEl.ownerDocument
    .createProcessingInstruction('twice-bake-text', i);
  textEl.parentNode.insertBefore(marker, textEl.nextSibling);
  console.log((new XMLSerializer).serializeToString(textEl.ownerDocument))
}


SVG.prototype.mergeReplacements = function mergeReplacements() {
  const newDoc = (new DOMParser).parseFromString(
    fs.readFileSync(this.filepath, 'utf8')
  );
  const replacements = Array.from(newDoc.getElementsByTagName('g'))
    .map(g => {
      const pi = getNextProcessingInstruction(g);
      if (pi && pi.target === 'twice-bake-text') {
        g.twiceBakeTextId = pi.data;
      }
      return g;
    })
    .filter(g => g.hasOwnProperty('twiceBakeTextId'))
    .map(cleanReplacement)
    .map(g => this.doc.importNode(g, true));

  this.texts.forEach((text, i) => {
    /* <text> can be nested but Inkscape destroys those, so there's no guarantee
       each texts[i] has a matching replacements[i] */
    const replacement = replacements.find(el => el.twiceBakeTextId == i);
    if (replacement) {
      text.parentNode.insertBefore(replacement, text.nextSibling);
      text.parentNode.removeChild(replacement.nextSibling); // delete marker
      text.setAttribute('opacity', 0);
    }
  });
};

function getNextProcessingInstruction(el) {
  let next = el.nextSibling;
  while (next) {
    if (next.nodeType === 7) { return next }
    else { next = next.nextSibling }
  }
}

function cleanReplacement(el) {
  const existingClasses = el.getAttribute('class');
  el.setAttribute('class',
    existingClasses ?
      `${existingClasses} ${options.replacementClass}` :
      options.replacementClass
  );
  el.removeAttribute('id'); // Inkscape sets a generic one
  el.removeAttribute('aria-label'); // already have the real <text>
  el.setAttribute('aria-hidden', 'true');

  removeTextStyles(el);
  const children = Array.from(el.getElementsByTagName('*'));
  children.map(removeTextStyles).forEach(el => {
    el.removeAttribute('id');
  });

  return el;
}

const textStylesRx = /line-height|font|text|-baseline/i;
function removeTextStyles(el) {
  const styles = el.getAttribute('style').split(';');
  const relevantStyles = styles.filter(style => ! textStylesRx.test(style));
  el.setAttribute('style', relevantStyles.join(';'));
  return el;
}


SVG.prototype.save = function saveSvg(filepath) {
  fs.writeFileSync(filepath || this.filepath, this.toString());
  this.filepath = filepath;
}
