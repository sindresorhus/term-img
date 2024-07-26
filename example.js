import terminalImage from './index.js';

console.log(terminalImage('fixture.jpg', {
	width: 50,
	fallback: () => 'Not supported here, sorry...',
}));
