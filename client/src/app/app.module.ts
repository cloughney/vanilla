import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRouterModule } from './app-router.module'
import { AppComponent } from './app.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipeGalleryComponent } from './recipe-gallery/recipe-gallery.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		AppRouterModule
	],
	declarations: [
		AppComponent,
		PageNotFoundComponent,
		RecipeDetailsComponent,
		RecipeGalleryComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
