import type { Card } from '../types/card';

export function useDragDrop(
	card: { value: Card },
	onCardLoaded: (card: Card) => void,
	onImageDropped: (imageUrl: string) => void
) {
	const handleDrop = async (event: DragEvent) => {
		console.log('File(s) dropped');
		event.preventDefault();

		if (event.dataTransfer?.items) {
			for (let i = 0; i < event.dataTransfer.items.length; i++) {
				const item = event.dataTransfer.items[i];

				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (!file) continue;

					console.log(`... file[${i}].name = ${file.name}`);

					if (file.type === 'application/json') {
						try {
							const text = await file.text();
							const cardData = JSON.parse(text);
							onCardLoaded(cardData);
						} catch (err) {
							alert(err);
						}
					} else if (file.type.startsWith('image/')) {
						const reader = new FileReader();
						reader.addEventListener('load', () => {
							if (typeof reader.result === 'string') {
								onImageDropped(reader.result);
							}
						});
						reader.readAsDataURL(file);
					} else {
						alert(`Unexpected file type, got '${file.type}'.`);
					}
				} else if (item.kind === 'string' && item.type.includes('url')) {
					const url = event.dataTransfer.getData(item.type);
					onImageDropped(url);
				}
			}
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};

	return {
		handleDrop,
		handleDragOver,
	};
}
