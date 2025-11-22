import { ref } from 'vue';

let upscaler_instance: any = null;
let upscaler_loaded_model: string | null = null;

async function getUpscalerInstance(model: string) {
	if (!upscaler_instance || model !== upscaler_loaded_model) {
		const Upscaler = await import('upscaler');
		upscaler_instance = new Upscaler.default({
			model: model,
		});
		upscaler_loaded_model = model;
	}
	return upscaler_instance;
}

export function useUpscaler() {
	const upscaling = ref(false);
	const upscaleCache = ref<Record<string, string>>({});

	const upscale = async (
		imageURL: string,
		model: string,
		progressCallback?: (progress: number | string) => void
	): Promise<string> => {
		if (upscaleCache.value[imageURL]) {
			return upscaleCache.value[imageURL];
		}

		upscaling.value = true;

		try {
			const blob = await fetch(imageURL).then((response) => response.blob());
			const imageObjectURL = URL.createObjectURL(blob);

			const defaultProgress = (arg: any) => {
				console.log('Upscaling... ', arg);
			};

			const upscalerInstance = await getUpscalerInstance(model);
			const result = await upscalerInstance.upscale(imageObjectURL, {
				patchSize: 64,
				padding: 6,
				progress: progressCallback ?? defaultProgress,
			});

			upscaleCache.value[imageURL] = result;
			upscaling.value = false;

			return result;
		} catch (error) {
			console.error(error);
			progressCallback?.(error as string);
			upscaling.value = false;
			throw error;
		}
	};

	return {
		upscaling,
		upscaleCache,
		upscale,
	};
}
