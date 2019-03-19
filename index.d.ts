/// <reference types="node"/>
import {ImageOptions} from 'ansi-escapes';

export interface Options<FallbackType = unknown> extends ImageOptions {
	/**
	Enables you to do something else when the terminal doesn't support images.

	@default () => throw new UnsupportedTerminalError()
	*/
	fallback?: () => FallbackType;
}

declare const termImg: {
	/**
	Log the image to the terminal directly.

	@param image - Filepath to an image or an image as a buffer.

	@example
	```
	import termImg from 'term-img';

	function fallback() {
		// Do something else when not supported
	}

	termImg('unicorn.jpg', {fallback});
	```
	*/
	(image: string | Buffer, options?: Options): void;

	/**
	Get the image as a `string` that you can log manually.

	@param image - Filepath to an image or an image as a buffer.
	*/
	string<FallbackType = unknown>(
		image: string | Buffer,
		options?: Options<FallbackType>
	): string | FallbackType;
};

export default termImg;

export class UnsupportedTerminalError extends Error {
	readonly name: 'UnsupportedTerminalError';

	constructor();
}
