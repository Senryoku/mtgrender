import { ref, computed, type Ref } from 'vue';

/**
 * Validation rules for MTG card fields
 */

export interface ValidationRule {
	validator: (value: any) => boolean;
	message: string;
}

export interface FieldValidation {
	isValid: Ref<boolean>;
	error: Ref<string>;
	validate: () => boolean;
	reset: () => void;
}

/**
 * Validates an MTG mana cost
 * Accepted format: {X}{2}{W}{U}{B}{R}{G}{C} etc.
 *
 * @example
 * ```ts
 * validateManaCost("{2}{W}{U}") // true
 * validateManaCost("{X}{W}") // true
 * validateManaCost("2WU") // false (no braces)
 * ```
 */
export function validateManaCost(value: string): boolean {
	if (!value || value.trim() === '') return true; // Empty is valid

	// Regex for valid mana symbols: {X}, {0-9+}, {W}, {U}, {B}, {R}, {G}, {C}, {S}
	// Also supports hybrid like {W/U}, {2/W}, phyrexian {W/P}, etc.
	const manaPattern = /^(\{([0-9XYZWUBRGCS]|[WUBRG]\/[WUBRG]|[0-9]\/[WUBRG]|[WUBRG]\/P|P\/[WUBRG]|H[WUBRGC]?)\})+$/;

	return manaPattern.test(value);
}

/**
 * Validates power/toughness
 * Accepted format: N/N, \*\/*, X/X, +N/+N, N+`\*\/N+\*, etc.
 *
 * @example
 * ```ts
 * validatePowerToughness("2\/2") // true
 * validatePowerToughness("*\/*") // true
 * validatePowerToughness("X/X") // true
 * validatePowerToughness("1+*\/1+*") // true
 * validatePowerToughness("abc") // false
 * ```
 */
export function validatePowerToughness(value: string): boolean {
	if (!value || value.trim() === '') return true; // Empty is valid

	// Pattern: number, *, X, or combinations with + like 2+*, 1+*
	const ptPattern = /^(\d+|\*|X|\d+\+\*)\s*\/\s*(\d+|\*|X|\d+\+\*)$/;

	return ptPattern.test(value.trim());
}

/**
 * Validates collector number
 * Accepted format: numbers, letters, and special characters
 *
 * @example
 * ```ts
 * validateCollectorNumber("123") // true
 * validateCollectorNumber("123a") // true
 * validateCollectorNumber("123★") // true
 * ```
 */
export function validateCollectorNumber(value: string): boolean {
	if (!value || value.trim() === '') return true; // Empty is valid

	// Pretty much anything goes for collector numbers
	return value.length > 0 && value.length <= 10;
}

/**
 * Validates loyalty (planeswalker)
 * Accepted format: positive integers or X
 *
 * @example
 * ```ts
 * validateLoyalty("3") // true
 * validateLoyalty("X") // true
 * validateLoyalty("-1") // false
 * ```
 */
export function validateLoyalty(value: string): boolean {
	if (!value || value.trim() === '') return true; // Empty is valid

	const loyaltyPattern = /^(\d+|X)$/;
	return loyaltyPattern.test(value.trim());
}

/**
 * Composable to validate a single field
 *
 * @param valueRef - Reference to the value to validate
 * @param rules - Array of validation rules
 * @returns Object with validation state and methods
 *
 * @example
 * ```ts
 * const manaCost = ref("{2}{W}{U}");
 * const manaCostValidation = useFieldValidation(manaCost, [
 *   {
 *     validator: validateManaCost,
 *     message: "Invalid mana cost format. Use {2}{W}{U} for example."
 *   }
 * ]);
 *
 * manaCostValidation.validate(); // checks validity
 * console.log(manaCostValidation.isValid.value); // true/false
 * console.log(manaCostValidation.error.value); // error message or ""
 * ```
 */
export function useFieldValidation(
	valueRef: Ref<string | number | undefined>,
	rules: ValidationRule[]
): FieldValidation {
	const error = ref('');

	const isValid = computed(() => {
		const value = valueRef.value;

		// Empty/undefined is generally valid unless required
		if (value === undefined || value === null || value === '') {
			return true;
		}

		for (const rule of rules) {
			if (!rule.validator(value)) {
				return false;
			}
		}

		return true;
	});

	const validate = (): boolean => {
		const value = valueRef.value;

		error.value = '';

		if (value === undefined || value === null || value === '') {
			return true;
		}

		for (const rule of rules) {
			if (!rule.validator(value)) {
				error.value = rule.message;
				return false;
			}
		}

		return true;
	};

	const reset = () => {
		error.value = '';
	};

	return {
		isValid,
		error,
		validate,
		reset,
	};
}

/**
 * Composable to validate multiple fields
 *
 * @param validations - Map of field validations
 * @returns Object with global validation state
 *
 * @example
 * ```ts
 * const { isFormValid, validateAll, resetAll } = useFormValidation({
 *   manaCost: manaCostValidation,
 *   powerToughness: ptValidation,
 * });
 *
 * if (validateAll()) {
 *   // All fields are valid
 * }
 * ```
 */
export function useFormValidation(validations: Record<string, FieldValidation>) {
	const isFormValid = computed(() => {
		return Object.values(validations).every((v) => v.isValid.value);
	});

	const validateAll = (): boolean => {
		let allValid = true;

		for (const validation of Object.values(validations)) {
			if (!validation.validate()) {
				allValid = false;
			}
		}

		return allValid;
	};

	const resetAll = () => {
		for (const validation of Object.values(validations)) {
			validation.reset();
		}
	};

	const getErrors = (): Record<string, string> => {
		const errors: Record<string, string> = {};

		for (const [key, validation] of Object.entries(validations)) {
			if (validation.error.value) {
				errors[key] = validation.error.value;
			}
		}

		return errors;
	};

	return {
		isFormValid,
		validateAll,
		resetAll,
		getErrors,
	};
}

/**
 * Predefined validation rules
 */
export const validationRules = {
	manaCost: {
		validator: validateManaCost,
		message: 'Invalid mana cost format. Use {2}{W}{U} for example.',
	},
	powerToughness: {
		validator: validatePowerToughness,
		message: 'Invalid format. Use N/N, */*, or X/X.',
	},
	collectorNumber: {
		validator: validateCollectorNumber,
		message: 'Invalid collector number (max 10 characters).',
	},
	loyalty: {
		validator: validateLoyalty,
		message: 'Invalid loyalty. Use a number or X.',
	},
	required: (fieldName: string) => ({
		validator: (value: any) => value !== undefined && value !== null && value !== '',
		message: `${fieldName} is required.`,
	}),
	minLength: (min: number) => ({
		validator: (value: string) => !value || value.length >= min,
		message: `Minimum ${min} characters required.`,
	}),
	maxLength: (max: number) => ({
		validator: (value: string) => !value || value.length <= max,
		message: `Maximum ${max} characters allowed.`,
	}),
};
