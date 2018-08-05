export interface Ingredient {
	amount: number;
	unit: string;
	name: string;
	details: string | null;
}

export interface IngredientGroup {
	name: string | null;
	ingredients: Ingredient[];
}

export interface Instruction {
	text: string;
	isComplete: boolean;
}

export interface InstructionGroup {
	name: string | null;
	instructions: Instruction[];
}

export interface Recipe {
	slug: string;
	title: string;
	description: string;
	yieldAmount: number;
	yieldUnit: string;
	ingredients: IngredientGroup[];
	instructions: InstructionGroup[];
}
