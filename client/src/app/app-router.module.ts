import { NgModule } from '@angular/core'
import { Route, RouterModule } from '@angular/router'

import { RecipeDetailsComponent } from './recipe-details/recipe-details.component'
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

const routes: Route[] = [
	{ path: 'recipe/new', component: RecipeDetailsComponent },
	{ path: 'recipe/edit/:slug', component: RecipeDetailsComponent },
	{ path: 'recipe/:slug', component: RecipeDetailsComponent },
	{ path: 'gallery', component: RecipeGalleryComponent },
	{ path: '', pathMatch: 'full', redirectTo: '/gallery' },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRouterModule { }
