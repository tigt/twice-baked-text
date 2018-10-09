module.exports = {
  // The folder of SVGs that you want to convert.
  input: './input/',

  // The folder to write the converted SVGs in.
  output: './output/',

  // Added to the `class` attribute of the `<g>`s generated from the original `<text>`s.
  replacementClass: 'twice-baked-text',

  // The command or file path used to call Inkscape from the command line.
  inkscapePath: 'inkscape',

  // Set this to true if you want the software to talk as it does things.
  verbose: true
};
