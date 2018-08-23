import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { Recipe, IngredientGroup, InstructionGroup } from '../recipe'
import { RecipeRepository } from '../recipe.repository';

const recipeTemplate: Recipe = {
	slug: '',
	title: '',
	description: '',
	yieldAmount: 12,
	yieldUnit: '',
	ingredients: [],
	instructions: []
};

@Component({
	selector: 'recipe-details',
	templateUrl: './recipe-details.component.html',
	styles: [
		`.title {
			font-weight: bold;
		}`
	]
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
	private readonly subscriptions: Subscription[];
	private recipeId?: number;
	private recipe: Recipe;

	public constructor(
		private readonly route: ActivatedRoute,
		private readonly recipeService: RecipeRepository) {
		this.subscriptions = [];
		this.yieldModifier = 1;
		this.recipe = recipeTemplate;
	}

	public yieldModifier: number;

	public ngOnInit(): void {
		const routeDataSubscription = this.route.data.subscribe(x => {
			//
		});

		const recipeSubscription = this.route.paramMap.pipe(
			switchMap((params): Observable<[number|undefined, Recipe]> => {
				const recipeSlug = params.get('slug');
				return recipeSlug
					? this.recipeService.getBySlug(recipeSlug)
					: of([undefined, recipeTemplate] as [undefined, Recipe]);
			})).subscribe(([id, recipe]) => {
				this.recipeId = id;
				this.recipe = recipe;
			});

		this.subscriptions.push(recipeSubscription, routeDataSubscription);
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach(x => x.unsubscribe());
	}


}
