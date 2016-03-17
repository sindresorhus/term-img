'use strict';
const termImg = require('./');

termImg('fixture.jpg', {
	width: 50,
	fallback: () => console.log('Not supported here, sorry...')
});
