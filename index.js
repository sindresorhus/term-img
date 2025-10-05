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
		return checkSemanticVersion(termVersion, '0.1.13');
	}

	if (termProgram === 'vscode') {
		return checkSemanticVersion(termVersion, '1.80.0');
	}

	return false;
}

function checkSemanticVersion(version, minimum) {
	function parseSemver(v) {
		if (!v) {
			return undefined;
		}

		const [major, minor, patch] = v
			.split('.')
			.map(n => Number.parseInt(n, 10));
		if (major === undefined || Number.isNaN(major)
			|| minor === undefined || Number.isNaN(minor)
			|| patch === undefined || Number.isNaN(patch)
		) {
			return undefined;
		}

		return {major, minor, patch};
	}

	const parsedVersion = parseSemver(version);
	const parsedMinimum = parseSemver(minimum);
	if (!parsedVersion || !parsedMinimum) {
		return false;
	}

	return parsedVersion.major > parsedMinimum.major
		|| (parsedVersion.major === parsedMinimum.major && parsedVersion.minor > parsedMinimum.minor)
		|| (parsedVersion.major === parsedMinimum.major && parsedVersion.minor === parsedMinimum.minor && parsedVersion.patch >= parsedMinimum.patch);
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
