import { watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, initialValue: T) {
	const getStoredValue = (): T => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	};

	const setStoredValue = (value: T): void => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing localStorage key "${key}":`, error);
		}
	};

	return {
		getStoredValue,
		setStoredValue,
	};
}

export function useLocalStorageSync<T>(key: string, valueRef: Ref<T>, deep = true) {
	watch(
		valueRef,
		(newValue) => {
			try {
				localStorage.setItem(key, JSON.stringify(newValue));
			} catch (error) {
				console.error(`Error syncing localStorage key "${key}":`, error);
			}
		},
		{ deep }
	);
}
