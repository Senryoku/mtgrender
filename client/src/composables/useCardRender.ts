import { ref, createApp, nextTick, type Ref } from 'vue';
import { downloadZip } from 'client-zip';
import type { Card, RenderOptions, RenderContext } from '../types/card';
import { renderService } from '../services/renderService';
import { modalService } from '../services/modalService';
import { useUpscaler } from './useUpscaler';
import { download } from '../utils';
import Progress from '../components/Progress.vue';

export function useCardRender(
	renderOptions: Ref<RenderOptions>,
	displayScale: Ref<number>,
	cardComponent: Ref<any>
) {
	const rendering = ref(false);
	const { upscale, upscaleCache } = useUpscaler();

	const renderCurrent = async (options?: RenderContext): Promise<string | Blob | null> => {
		const cardComp = cardComponent.value;
		if (!cardComp) return null;

		options?.progress?.push_task({
			name: `Render '${cardComp.card_face.name}'`,
		});

		try {
			const card_display_el = document.querySelector('.card-display') as HTMLElement;
			const card_el = document.querySelector('.mtg-card') as HTMLElement;

			if (!card_display_el || !card_el) {
				throw new Error('Card elements not found');
			}

			card_el.classList.add('rendering');
			const cleanupFuncs: Array<() => void> = [];
			cleanupFuncs.push(() => card_el.classList.remove('rendering'));

			const cleanup = () => cleanupFuncs.forEach((c) => c());

			const margin_px = (3288 / 63.5) * renderOptions.value.margin;
			const scale = 3288 / card_el.clientWidth / displayScale.value;

			// Handle upscaling
			if (renderOptions.value.upscale) {
				options?.progress?.push_step('Upscale Illustration');
				const original =
					cardComp.card_face?.image_uris?.art_crop ?? cardComp.card.image_uris?.art_crop;

				if (original) {
					if (!(original in upscaleCache.value)) {
						upscaleCache.value[original] = await upscale(
							original,
							renderOptions.value.upscalerModel,
							(percent) => {
								if (isNaN(percent as number)) {
									options?.progress?.fail_step(percent as string);
								} else {
									options?.progress?.update_step({
										type: 'percent',
										value: (100 * (percent as number)).toFixed(2),
									});
								}
							}
						);
					} else {
						options?.progress?.update_step('Cached!');
					}

					const illustration_el = card_el.querySelector('.illustration') as HTMLElement;
					if (illustration_el) {
						const backgroundImageBackup = illustration_el.style.backgroundImage;
						illustration_el.style.backgroundImage =
							'url(' + upscaleCache.value[original] + ')';
						cleanupFuncs.push(
							() => (illustration_el.style.backgroundImage = backgroundImageBackup)
						);
						await nextTick();
					}
					options?.progress?.end_step();
				} else {
					console.warn(`Upscaler: '${cardComp.card_face.name}' does not have an illustration.`);
					options?.progress?.fail_step('No image');
				}
			}

			// Pre-render
			options?.progress?.push_step('Pre Render');
			const renderFunc = options?.toBlob || renderOptions.value.optimize ? 'toBlob' : 'toPng';

			try {
				if (renderFunc === 'toBlob') {
					await renderService.renderToBlob(
						card_display_el,
						2 * margin_px + displayScale.value * scale * card_el.clientWidth,
						2 * margin_px + displayScale.value * scale * card_el.clientHeight,
						scale,
						`${renderOptions.value.margin * displayScale.value}mm`
					);
				} else {
					await renderService.renderToPng(
						card_display_el,
						2 * margin_px + displayScale.value * scale * card_el.clientWidth,
						2 * margin_px + displayScale.value * scale * card_el.clientHeight,
						scale,
						`${renderOptions.value.margin * displayScale.value}mm`
					);
				}
			} catch (error: any) {
				console.error('Error generating first render:', error);
				options?.progress?.fail_task(error.message);
				cleanup();
				return null;
			}

			// Final render
			options?.progress?.end_step();
			options?.progress?.push_step('Final Render');

			let result: Blob | string;
			try {
				if (renderFunc === 'toBlob') {
					result = await renderService.renderToBlob(
						card_display_el,
						2 * margin_px + displayScale.value * scale * card_el.clientWidth,
						2 * margin_px + displayScale.value * scale * card_el.clientHeight,
						scale,
						`${renderOptions.value.margin * displayScale.value}mm`
					);
				} else {
					result = await renderService.renderToPng(
						card_display_el,
						2 * margin_px + displayScale.value * scale * card_el.clientWidth,
						2 * margin_px + displayScale.value * scale * card_el.clientHeight,
						scale,
						`${renderOptions.value.margin * displayScale.value}mm`
					);
				}
			} catch (error: any) {
				console.error('Error generating render:', error);
				options?.progress?.fail_task(error.message);
				cleanup();
				return null;
			}

			options?.progress?.end_step();

			// Optimize PNG
			if (renderOptions.value.optimize && result instanceof Blob) {
				options?.progress?.push_step('Optimize output PNG');
				try {
					const optimized = await renderService.optimizePng(
						result,
						`${cardComp.card_face.name}.png`,
						options?.progress
					);

					result = options?.toBlob
						? new Blob([optimized], { type: 'image/png' })
						: 'data:image/png;base64,' + renderService.uint8ToBase64(optimized);

					options?.progress?.end_task();
				} catch (err) {
					options?.progress?.fail_step(err as string);
					options?.progress?.fail_task();
					cleanup();
					return null;
				}
			} else {
				options?.progress?.end_task();
			}

			cleanup();
			return result;
		} catch (err) {
			options?.progress?.fail_task(err as string);
			return null;
		}
	};

	const render = async () => {
		rendering.value = true;
		const modal = modalService.open({ disposable: false });
		const progress = createApp(Progress).mount(modal.$refs.defaultSlot);

		let errored = false;

		try {
			const cardComp = cardComponent.value;
			if (!cardComp) {
				throw new Error('Card component not found');
			}

			if (cardComp.is_dualfaced) {
				for (let idx = 0; idx < cardComp.card.card_faces.length; ++idx) {
					cardComp.set_face(idx);
					const dataUrl = await renderCurrent({ progress });
					if (dataUrl) {
						download(`${cardComp.card_face.name}.png`, dataUrl as string);
					} else {
						errored = true;
					}
				}
			} else {
				const dataUrl = await renderCurrent({ progress });
				if (dataUrl) {
					download(`${cardComp.card.name}.png`, dataUrl as string);
				} else {
					errored = true;
				}
			}
		} catch (err) {
			console.error(err);
			errored = true;
		}

		modal.set_disposable(true);
		if (!errored) {
			setTimeout(() => {
				// modal.close();
			}, 1000);
		}
		rendering.value = false;
	};

	const renderAll = async (cards: Card[]) => {
		rendering.value = true;
		const modal = modalService.open({ disposable: false });
		const progress = createApp(Progress).mount(modal.$refs.defaultSlot);
		const renders: Array<{ name: string; lastModified: Date; input: Blob }> = [];

		for (const c of cards) {
			try {
				const cardComp = cardComponent.value;
				if (!cardComp) continue;

				cardComp.card = c;
				await nextTick();

				if (cardComp.is_dualfaced) {
					for (let idx = 0; idx < c.card_faces!.length; ++idx) {
						cardComp.set_face(idx);
						const input = await renderCurrent({ toBlob: true, progress });
						if (input) {
							renders.push({
								name: cardComp.card_face.name + '.png',
								lastModified: new Date(),
								input: input as Blob,
							});
						}
					}
				} else {
					const input = await renderCurrent({ toBlob: true, progress });
					if (input) {
						renders.push({
							name: c.name + '.png',
							lastModified: new Date(),
							input: input as Blob,
						});
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		progress.push_task({ name: 'Create ZIP archive' });
		const blob = await downloadZip(renders).blob();
		progress.end_task();

		download('MTGRenders.zip', URL.createObjectURL(blob));

		modal.set_disposable(true);
		rendering.value = false;
	};

	return {
		rendering,
		render,
		renderAll,
		renderCurrent,
	};
}
