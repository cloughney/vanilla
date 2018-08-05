import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

import { Recipe, IngredientGroup, InstructionGroup } from '../recipe'
import { RecipeRepository } from '../recipe.repository';

@Component({
	selector: 'recipe-details',
	templateUrl: './recipe-details.component.html',
	styles: [`
		.title {
			font-weight: bold;
		}
	`]
})
export class RecipeDetailsComponent implements OnInit {
	private recipe$?: Observable<[number, Recipe]>;
	private recipeId?: number;
	private recipe?: Recipe;

	public constructor(
		private readonly route: ActivatedRoute,
		private readonly recipeService: RecipeRepository) { }

	public get slug(): string { return this.recipe ? this.recipe.slug : ''; }
	public get title(): string { return this.recipe ? this.recipe.title : ''; }
	public get description(): string { return this.recipe ? this.recipe.description : ''; }
	public get yield(): string { return this.recipe ? `${this.recipe.yieldAmount} ${this.recipe.yieldUnit}` : ''; }
	public get ingredients(): IngredientGroup[] { return this.recipe ? this.recipe.ingredients : [] }
	public get instructions(): InstructionGroup[] { return this.recipe ? this.recipe.instructions : [] }

	public ngOnInit(): void {
		this.recipe$ = this.route.paramMap.pipe(
			switchMap(params => this.recipeService.getBySlug(params.get('slug') as string)));

		this.recipe$.subscribe(([key, recipe]) => {
			this.recipeId = key;
			this.recipe = recipe;
		});
	}
}
