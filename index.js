import process from 'node:process';
import fs from 'node:fs';
import iterm2Version from 'iterm2-version';
import ansiEscapes from 'ansi-escapes';

export class UnsupportedTerminalError extends Error {
	constructor() {
		super('Supported terminals:\n'
			+ '- iTerm2 >= v3\n'
			+ '- WezTerm >= v20220319\n'
			+ '- Konsole >= v22.04\n'
			+ '- Rio >= v0.1.13\n'
			+ '- VSCode >= v1.80\n\n',
		);
		this.name = 'UnsupportedTerminalError';
	}
}

function unsupported() {
	throw new UnsupportedTerminalError();
}

function isITerm2IIPSupported() {
	const termProgram = process.env.TERM_PROGRAM;
	const termVersion = process.env.TERM_PROGRAM_VERSION;

	if (termProgram === 'iTerm.app') {
		return checkITermVersion();
	}

	if (termProgram === 'WezTerm') {
		return checkWezTermVersion(termVersion);
	}

	if (process.env.KONSOLE_VERSION) {
		return checkKonsoleVersion(process.env.KONSOLE_VERSION);
	}

	if (termProgram === 'rio') {
		return checkRioVersion(termVersion);
	}

	if (termProgram === 'vscode') {
		return checkVSCodeVersion(termVersion);
	}

	return false;
}

function checkITermVersion() {
	const version = iterm2Version();
	return version && Number(version[0]) >= 3;
}

function checkWezTermVersion(version) {
	if (!version) {
		return false;
	}

	const date = Number.parseInt(version.split('-')[0], 10);
	return !Number.isNaN(date) && date >= 20_220_319;
}

function checkKonsoleVersion(version) {
	if (!version) {
		return false;
	}

	const date = Number.parseInt(version, 10);
	return !Number.isNaN(date) && date >= 220_400;
}

function checkRioVersion(version) {
	if (!version) {
		return false;
	}

	const [major, minor, patch] = version
		.split('.')
		.map(v => Number.parseInt(v, 10));

	if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
		return false;
	}

	return major > 0
		|| (major === 0 && minor > 1)
		|| (major === 0 && minor === 1 && patch >= 13);
}

function checkVSCodeVersion(version) {
	if (!version) {
		return false;
	}

	const [major, minor, patch] = version
		.split('.')
		.map(v => Number.parseInt(v, 10));

	if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
		return false;
	}

	return major > 1 || (major === 1 && minor >= 80);
}

export default function terminalImage(image, options = {}) {
	const fallback = typeof options.fallback === 'function' ? options.fallback : unsupported;

	if (!(image && image.length > 0)) {
		throw new TypeError('Image required');
	}

	if (!isITerm2IIPSupported()) {
		return fallback();
	}

	if (typeof image === 'string') {
		image = fs.readFileSync(image);
	}

	return ansiEscapes.image(image, options);
}
