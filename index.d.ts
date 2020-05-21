/// <reference types="node"/>
import {ImageOptions} from 'ansi-escapes';

declare class UnsupportedTerminalErrorClass extends Error {
	readonly name: 'UnsupportedTerminalError';

	constructor();
}

declare namespace termImg {
	interface Options<FallbackType = unknown> extends ImageOptions {
		/**
		Enables you to do something else when the terminal doesn't support images.

		@default () => throw new UnsupportedTerminalError()
		*/
		readonly fallback?: () => FallbackType;
	}

	type UnsupportedTerminalError = UnsupportedTerminalErrorClass;
}

declare const termImg: {
	UnsupportedTerminalError: typeof UnsupportedTerminalErrorClass;

	/**
	Get the image as a `string` that you can log manually.

	@param image - Filepath to an image or an image as a buffer.

	@example
	```
	import termImg = require('term-img');

	function fallback() {
		// Do something else when not supported
	}

	termImg('unicorn.jpg', {fallback});
	```
	*/
	<FallbackType>(
		image: string | Buffer,
		options?: termImg.Options<FallbackType>
	): string | FallbackType;
};

export = termImg;
