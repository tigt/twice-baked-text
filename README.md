# Twice-baked Text

This is a command-line tool that converts `<text>` elements inside

## How to use

### Installation

1. Install [Inkscape](https://inkscape.org/release/) and make sure it’s in your PATH.
2. Download this repo somehow [TODO]
3. `npm i` to install. (Or `yarn` if you have it.)

### Configuration

Right now, you change `settings.js`:

- `input` &mdash; the folder that holds the SVG files to convert.

- `output` &mdash; the folder to write the converted SVGs into.

- `verbose` &mdash; the software chats about what it’s doing every step of the way. Beware, Inkscape can be really chatty.

- `inkscapePath` &mdash; if calling just the command `inkscape` doesn’t work for some reason, put the path to the Inkscape binary here. For example, the default install of certain versions of Inkscape on MacOS may work if you change this to `/Applications/Inkscape.app/Contents/Resources/bin/inkscape-bin`.

- `replacementClass` &mdash; after Inkscape turns your `<text>` elements into `<path>`s, what `class` should it add to them?

### Actually doing the thang ding

```sh
node ./twice-bake-text.js
```

A real CLI (command-line interface) would be cool, but only if enough people find this useful.

## Feedback

If the performance is too slow for you, please let me know. My 4GB/1.6GHz MacBook Air chewed through 10,000 SVGs in 4 minutes &mdash; but most of that was waiting for Inkscape, so I’m not sure if I can do anything about that.
