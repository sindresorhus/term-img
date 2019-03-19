import {expectType} from 'tsd-check';
import termImg, {UnsupportedTerminalError} from '.';

expectType<void>(termImg('/foo/bar.jpg'));
expectType<void>(termImg(new Buffer(1)));
expectType<void>(termImg('/foo/bar.jpg', {width: 1}));
expectType<void>(termImg('/foo/bar.jpg', {fallback: () => false}));

expectType<string>(termImg.string('/foo/bar.jpg'));
expectType<string>(termImg.string(new Buffer(1)));
expectType<string>(termImg.string('/foo/bar.jpg', {width: 1}));
expectType<string | boolean>(
	termImg.string('/foo/bar.jpg', {fallback: () => false})
);

expectType<typeof UnsupportedTerminalError>(UnsupportedTerminalError);
