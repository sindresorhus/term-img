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
	/**
	Log the image to the terminal directly.

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
	(image: string | Buffer, options?: termImg.Options): void;

	/**
	Get the image as a `string` that you can log manually.

	@param image - Filepath to an image or an image as a buffer.
	*/
	string<FallbackType = unknown>(
		image: string | Buffer,
		options?: termImg.Options<FallbackType>
	): string | FallbackType;

	UnsupportedTerminalError: typeof UnsupportedTerminalErrorClass;
};

export = termImg;
