'use strict';
const fs = require('fs');
const iterm2Version = require('iterm2-version');
const ansiEscapes = require('ansi-escapes');

class TermImgNotSupported extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = 'iTerm >=2.9 required';
	}
}

module.exports = (img, opts) => {
	opts = opts || {};

	if (!img) {
		return Promise.reject(new TypeError('Image required'));
	}

	if (process.env.TERM_PROGRAM !== 'iTerm.app') {
		return Promise.reject(new TermImgNotSupported());
	}

	return iterm2Version().then(version => {
		if (version[0] < 2 && version[1] < 9) {
			return Promise.reject(new TermImgNotSupported());
		}

		if (typeof img === 'string') {
			img = fs.readFileSync(img);
		}

		console.log(ansiEscapes.image(img, opts));
	});
};
