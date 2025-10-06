import process from 'node:process';
import test from 'ava';
import terminalImage, {UnsupportedTerminalError} from './index.js';

test.beforeEach(t => {
	// Save original environment in t.context
	t.context.originalEnv = {
		TERM_PROGRAM: process.env.TERM_PROGRAM,
		TERM_PROGRAM_VERSION: process.env.TERM_PROGRAM_VERSION,
		KONSOLE_VERSION: process.env.KONSOLE_VERSION,
	};
	t.context.originalPlatform = process.platform;
});

test.afterEach(t => {
	// Restore environment variables
	for (const [key, value] of Object.entries(t.context.originalEnv)) {
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}

	// Restore platform
	Object.defineProperty(process, 'platform', {
		value: t.context.originalPlatform,
		writable: false,
		configurable: false,
	});
});

// Helper function for DRY environment setup
function setupEnvironment(environmentVariables = {}) {
	// Clear environment
	const envKeys = ['TERM_PROGRAM', 'TERM_PROGRAM_VERSION', 'KONSOLE_VERSION'];
	for (const key of envKeys) {
		delete process.env[key];
	}

	// Set new environment variables
	for (const [key, value] of Object.entries(environmentVariables)) {
		if (value !== undefined) {
			process.env[key] = value;
		}
	}
}

function setPlatform(platform) {
	Object.defineProperty(process, 'platform', {
		value: platform,
		writable: true,
		configurable: true,
	});
}

// Test helper for supported terminal configurations
const supportedTerminals = [
	{
		name: 'iTerm2',
		env: {TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.3.7'},
		platform: 'darwin',
	},
	{
		name: 'WezTerm',
		env: {TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20220319-123456-abcdefgh'},
	},
	{
		name: 'Konsole',
		env: {KONSOLE_VERSION: '220400'},
	},
	{
		name: 'Rio',
		env: {TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.13'},
	},
	{
		name: 'VSCode',
		env: {TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.80.0'},
	},
];

for (const terminal of supportedTerminals) {
	test(`${terminal.name} support`, t => {
		setupEnvironment(terminal.env);
		if (terminal.platform) {
			setPlatform(terminal.platform);
		}

		// Test that it doesn't throw for supported terminals
		const result = terminalImage('fixture.jpg');
		t.truthy(result);
	});
}

// Error handling and fallback behavior tests
test('throws UnsupportedTerminalError for unsupported terminal', t => {
	setupEnvironment({});
	setPlatform('linux'); // Ensure non-macOS platform

	const error = t.throws(() => {
		terminalImage('fixture.jpg');
	}, {instanceOf: UnsupportedTerminalError});

	t.is(error.name, 'UnsupportedTerminalError');
});

test('calls custom fallback function when terminal is unsupported', t => {
	let fallbackCalled = false;
	const fallbackReturnValue = 'fallback-result';

	const customFallback = () => {
		fallbackCalled = true;
		return fallbackReturnValue;
	};

	setupEnvironment({});

	const result = terminalImage('fixture.jpg', {fallback: customFallback});

	t.true(fallbackCalled);
	t.is(result, fallbackReturnValue);
});

test('throws UnsupportedTerminalError when fallback is not a function', t => {
	setupEnvironment({});

	t.throws(() => {
		terminalImage('fixture.jpg', {fallback: 'not-a-function'});
	}, {instanceOf: UnsupportedTerminalError});
});

// Input validation tests
test('throws TypeError for undefined image', t => {
	setupEnvironment(supportedTerminals[1].env); // WezTerm

	const error = t.throws(() => {
		terminalImage();
	}, {instanceOf: TypeError});

	t.is(error.message, 'Image required');
});

test('throws TypeError for null image', t => {
	setupEnvironment(supportedTerminals[1].env);

	const error = t.throws(() => {
		terminalImage(null);
	}, {instanceOf: TypeError});

	t.is(error.message, 'Image required');
});

test('throws TypeError for empty string image', t => {
	setupEnvironment(supportedTerminals[1].env);

	const error = t.throws(() => {
		terminalImage('');
	}, {instanceOf: TypeError});

	t.is(error.message, 'Image required');
});

test('throws TypeError for empty Uint8Array image', t => {
	setupEnvironment(supportedTerminals[1].env);

	const error = t.throws(() => {
		terminalImage(new Uint8Array(0));
	}, {instanceOf: TypeError});

	t.is(error.message, 'Image required');
});

test('accepts valid Uint8Array image', t => {
	setupEnvironment(supportedTerminals[1].env);

	const imageData = new Uint8Array([1, 2, 3, 4]); // Minimal non-empty array
	const result = terminalImage(imageData);

	t.truthy(result);
});

test('handles options parameter correctly', t => {
	setupEnvironment(supportedTerminals[1].env);

	t.notThrows(() => {
		terminalImage('fixture.jpg');
	});

	// Test with empty options object
	t.notThrows(() => {
		terminalImage('fixture.jpg', {});
	});

	// Test with valid options
	t.notThrows(() => {
		terminalImage('fixture.jpg', {width: 100, height: 50});
	});
});

// Unsupported terminal version tests
// Skipping iTerm2 test since probably no one is on an unsupported version
test('WezTerm with old version should be unsupported', t => {
	setupEnvironment({TERM_PROGRAM: 'WezTerm', TERM_PROGRAM_VERSION: '20220318-123456-abcdefgh'});
	t.throws(() => terminalImage('fixture.jpg'), {instanceOf: UnsupportedTerminalError});
});

test('Rio with old version should be unsupported', t => {
	setupEnvironment({TERM_PROGRAM: 'rio', TERM_PROGRAM_VERSION: '0.1.12'});
	t.throws(() => terminalImage('fixture.jpg'), {instanceOf: UnsupportedTerminalError});
});

test('VSCode with old version should be unsupported', t => {
	setupEnvironment({TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.79.0'});
	t.throws(() => terminalImage('fixture.jpg'), {instanceOf: UnsupportedTerminalError});
});

test('Konsole with old version should be unsupported', t => {
	setupEnvironment({KONSOLE_VERSION: '220300'});
	t.throws(() => terminalImage('fixture.jpg'), {instanceOf: UnsupportedTerminalError});
});
