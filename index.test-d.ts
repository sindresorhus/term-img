import {expectType} from 'tsd';
import termImg = require('.');
import {UnsupportedTerminalError} from '.';

expectType<string>(termImg('/foo/bar.jpg'));
expectType<string>(termImg(Buffer.alloc(1)));
expectType<string>(termImg('/foo/bar.jpg', {width: 1}));
expectType<string | false>(
	termImg('/foo/bar.jpg', {fallback: () => false})
);

const unsupportedTerminalError = new UnsupportedTerminalError();
expectType<UnsupportedTerminalError>(unsupportedTerminalError);
