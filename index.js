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

module.exports = (image, options = {}) => {
	const fallback = typeof options.fallback === 'function' ? options.fallback : unsupported;

	if (!(image && image.length > 0)) {
		throw new TypeError('Image required');
	}

	if (process.env.TERM_PROGRAM !== 'iTerm.app') {
		return fallback();
	}

	const version = iterm2Version();

	if (Number(version[0]) < 3) {
		return fallback();
	}

	if (typeof image === 'string') {
		image = fs.readFileSync(image);
	}

	return ansiEscapes.image(image, options);
};

module.exports.UnsupportedTerminalError = UnsupportedTerminalError;
