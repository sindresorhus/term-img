import {expectType} from 'tsd';
import termImg = require('.');
import {UnsupportedTerminalError} from '.';

expectType<void>(termImg('/foo/bar.jpg'));
expectType<void>(termImg(Buffer.from(1)));
expectType<void>(termImg('/foo/bar.jpg', {width: 1}));
expectType<void>(termImg('/foo/bar.jpg', {fallback: () => false}));

expectType<string>(termImg.string('/foo/bar.jpg'));
expectType<string>(termImg.string(Buffer.from(1)));
expectType<string>(termImg.string('/foo/bar.jpg', {width: 1}));
expectType<string | boolean>(
	termImg.string('/foo/bar.jpg', {fallback: () => false})
);

const unsupportedTerminalError = new UnsupportedTerminalError();
expectType<UnsupportedTerminalError>(unsupportedTerminalError);
