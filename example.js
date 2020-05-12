'use strict';
const termImg = require('.');

console.log(termImg('fixture.jpg', {
	width: 50,
	fallback: () => 'Not supported here, sorry...'
}));
