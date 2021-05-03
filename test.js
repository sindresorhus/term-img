import test from 'ava';
import terminalImage from './index.js';

test('main', t => {
	process.env.TERM_PROGRAM = 'iTerm.app';
	process.env.TERM_PROGRAM_VERSION = '3.3.7';
	t.snapshot(terminalImage('fixture.jpg'));
});
