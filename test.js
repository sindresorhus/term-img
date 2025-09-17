import process from 'node:process';
import test from 'ava';
import terminalImage from './index.js';

test('iTerm2', t => {
	// Make the test think it's running on macOS
	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {
		value: originalPlatform,
		writable: true,
		configurable: true,
	});

	process.platform = 'darwin';
	process.env.TERM_PROGRAM = 'iTerm.app';
	process.env.TERM_PROGRAM_VERSION = '3.3.7';
	t.snapshot(terminalImage('fixture.jpg'));
	Object.defineProperty(process, 'platform', {
		value: originalPlatform,
		writable: false,
		configurable: false,
	});
});

test('WezTerm', t => {
	process.env.TERM_PROGRAM = 'WezTerm';
	process.env.TERM_PROGRAM_VERSION = '20220319-123456-abcdefgh';
	t.snapshot(terminalImage('fixture.jpg'));
});

test('Konsole', t => {
	process.env.KONSOLE_VERSION = '220400';
	t.snapshot(terminalImage('fixture.jpg'));
});

test('Rio', t => {
	process.env.TERM_PROGRAM = 'rio';
	process.env.TERM_PROGRAM_VERSION = '0.1.13';
	t.snapshot(terminalImage('fixture.jpg'));
});

test('VSCode', t => {
	process.env.TERM_PROGRAM = 'vscode';
	process.env.TERM_PROGRAM_VERSION = '1.80.0';
	t.snapshot(terminalImage('fixture.jpg'));
});
