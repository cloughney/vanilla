import { Component, OnInit } from '@angular/core'
import { Recipe } from '../recipe';
import { RecipeRepository } from '../recipe.repository';

@Component({
	template: `
		<div>
			Recipes
			<div>
				<a routerLink="/recipe/new">Add Recipe</a>
			</div>
			<ul>
				<li *ngFor="let recipe of visibleRecipes">
					<a routerLink="/recipe/view/{{ recipe.slug }}">{{ recipe.title }}</a>
				</li>
			</ul>
		</div>
	`
})
export class RecipeGalleryComponent implements OnInit {
	public constructor(private readonly recipes: RecipeRepository) { }

	public visibleRecipes?: Recipe[];

	public ngOnInit(): void {
		this.recipes.list().subscribe(x => {
			this.visibleRecipes = x.map(([id, recipe]) => recipe);
		});
	}
}
