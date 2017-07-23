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
		return fallback;
	}

	const version = iterm2Version();

	if (Number(version[0]) < 3) {
		return fallback;
	}

	if (typeof img === 'string') {
		img = fs.readFileSync(img);
	}

	return ansiEscapes.image(img, opts);
}

module.exports = (img, opts) => {
	const ret = main(img, opts);

	if (typeof ret === 'function') {
		ret();
		return;
	}

	console.log(ret);
};

module.exports.string = (img, opts) => {
	const ret = main(img, opts);

	if (typeof ret === 'function') {
		return ret();
	}

	return ret;
};
