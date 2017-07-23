'use strict';
const fs = require('fs');
const iterm2Version = require('iterm2-version');
const ansiEscapes = require('ansi-escapes');

class UnsupportedTerminalError extends Error {
	constructor() {
		super('iTerm >=3 required');
		this.name = 'UnsupportedTerminalError';
	}
}

function unsupported() {
	throw new UnsupportedTerminalError();
}

function main(img, opts) {
	opts = opts || {};

	const fallback = typeof opts.fallback === 'function' ? opts.fallback : unsupported;

	if (!(img && img.length > 0)) {
		throw new TypeError('Image required');
	}

	if (process.env.TERM_PROGRAM !== 'iTerm.app') {
		fallback();
		return;
	}

	const version = iterm2Version();

	if (Number(version[0]) < 3) {
		fallback();
		return;
	}

	if (typeof img === 'string') {
		img = fs.readFileSync(img);
	}

	return ansiEscapes.image(img, opts);
}

module.exports = (img, opts) => {
	console.log(main(img, opts));
};

module.exports.string = main;
