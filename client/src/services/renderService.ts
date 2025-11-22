import domtoimage from 'dom-to-image';
import type { RenderProgress } from '../types/card';

let optipngWorker: Worker | null = null;

function loadWebWorker() {
	if (!optipngWorker) {
		optipngWorker = new Worker('./workers/optipng.worker.js', {
			type: 'module',
		});
	}
}

function Uint8ToString(u8a: Uint8Array): string {
	const CHUNK_SZ = 0x8000;
	const c = [];
	for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
		c.push(String.fromCharCode.apply(null, Array.from(u8a.subarray(i, i + CHUNK_SZ))));
	}
	return c.join('');
}

export const renderService = {
	async renderToBlob(
		element: HTMLElement,
		width: number,
		height: number,
		scale: number,
		margin: string
	): Promise<Blob> {
		// Pre-render to ensure images load
		await domtoimage.toBlob(element).catch(console.error);

		// Final render
		return await domtoimage.toBlob(element, {
			width,
			height,
			style: {
				'transform-origin': 'top left',
				transform: `scale(${scale})`,
				'background-color': 'black',
				padding: margin,
			},
		});
	},

	async renderToPng(
		element: HTMLElement,
		width: number,
		height: number,
		scale: number,
		margin: string
	): Promise<string> {
		// Pre-render to ensure images load
		await domtoimage.toPng(element).catch(console.error);

		// Final render
		return await domtoimage.toPng(element, {
			width,
			height,
			style: {
				'transform-origin': 'top left',
				transform: `scale(${scale})`,
				'background-color': 'black',
				padding: margin,
			},
		});
	},

	async optimizePng(
		blob: Blob,
		filename: string,
		progress?: RenderProgress
	): Promise<Uint8Array> {
		loadWebWorker();

		return new Promise((resolve, reject) => {
			let input_file_size = 0;
			let output_file_size = 0;

			if (!optipngWorker) {
				reject(new Error('OptiPNG worker not available'));
				return;
			}

			optipngWorker.onmessage = function (event) {
				const message = event.data;
				if (message.type === 'stdout') {
					console.log('OptiPNG Worker:', message.data);

					const match_input = message.data.match(/Input file size = (\d+) bytes/);
					if (match_input) {
						input_file_size = parseInt(match_input[1]);
						progress?.update_step(
							`Original Size: ${(input_file_size / 1024 / 1024).toFixed(2)}MB`
						);
					}

					const match_output = message.data.match(/Output file size = (\d+) bytes/);
					if (match_output) {
						output_file_size = parseInt(match_output[1]);
						progress?.update_step(
							`${(input_file_size / 1024 / 1024).toFixed(2)}MB => ${(
								output_file_size / 1024 / 1024
							).toFixed(2)}MB`
						);
					}
				} else if (message.type === 'done') {
					progress?.end_step(
						`${(input_file_size / 1024 / 1024).toFixed(2)}MB => ${(
							output_file_size / 1024 / 1024
						).toFixed(2)}MB`
					);
					resolve(message.data.data);
				}
			};

			optipngWorker.onerror = (error) => {
				reject(error);
			};

			blob.arrayBuffer().then((buffer) => {
				optipngWorker!.postMessage({
					type: 'command',
					arguments: ['-o1'],
					file: {
						name: filename,
						data: new Uint8Array(buffer),
					},
				});
			});
		});
	},

	uint8ToBase64(u8a: Uint8Array): string {
		return btoa(Uint8ToString(u8a));
	},
};
