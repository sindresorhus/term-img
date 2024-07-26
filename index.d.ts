import {type ImageOptions} from 'ansi-escapes';

export class UnsupportedTerminalError extends Error {
	readonly name: 'UnsupportedTerminalError';

	constructor();
}

export type Options<FallbackType = unknown> = {
	/**
	Enables you to do something else when the terminal doesn't support images.

	@default () => throw new UnsupportedTerminalError()
	*/
	readonly fallback?: () => FallbackType;
} & ImageOptions;

/**
Get the image as a `string` that you can log manually.

@param image - File path to an image or an image as a buffer.

@example
```
import terminalImage from 'term-img';

function fallback() {
	// Do something else when not supported
}

terminalImage('unicorn.jpg', {fallback});
```
*/
export default function terminalImage<FallbackType>(
	image: string | Uint8Array,
	options?: Options<FallbackType>
): string | FallbackType;
