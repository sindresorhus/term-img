import {expectType} from 'tsd';
import terminalImage, {UnsupportedTerminalError} from './index.js';

expectType<string>(terminalImage('/foo/bar.jpg'));
expectType<string>(terminalImage(Buffer.alloc(1)));
expectType<string>(terminalImage('/foo/bar.jpg', {width: 1}));
expectType<string | false>(
	terminalImage('/foo/bar.jpg', {fallback: () => false})
);

const unsupportedTerminalError = new UnsupportedTerminalError();
expectType<UnsupportedTerminalError>(unsupportedTerminalError);
