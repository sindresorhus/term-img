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

function main(image, options = {}) {
	const fallback = typeof options.fallback === 'function' ? options.fallback : unsupported;

	if (!(image && image.length > 0)) {
		throw new TypeError('Image required');
	}

	if (process.env.TERM_PROGRAM !== 'iTerm.app') {
		return fallback;
	}

	const version = iterm2Version();

	if (Number(version[0]) < 3) {
		return fallback;
	}

	if (typeof image === 'string') {
		image = fs.readFileSync(image);
	}

	return ansiEscapes.image(image, options);
}

const termImg = (image, options) => {
	const ret = main(image, options);

	if (typeof ret === 'function') {
		ret();
		return;
	}

	console.log(ret);
};

module.exports = termImg;

module.exports.string = (image, options) => {
	const ret = main(image, options);

	if (typeof ret === 'function') {
		return ret();
	}

	return ret;
};

module.exports.UnsupportedTerminalError = UnsupportedTerminalError;
