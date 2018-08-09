import { Injectable } from '@angular/core'
import { Observable, of, forkJoin } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import { Recipe } from './recipe'

type StorageIndexValue = string | number | boolean;
type StorageIndex<TModel> = (keyof TModel)[];
type StorageIndexQuery<TModel> = { [P in keyof TModel]?: P extends StorageIndexValue ? TModel[P] : never };

interface RepositoryItem<TKey, TModel> {
	readonly id: TKey;
	readonly model: TModel;
	readonly updated: number;
	readonly isLocalChanged: boolean;
	readonly indexes: StorageIndex<TModel>[];
}

abstract class GenericRepository<TKey extends string | number, TModel> {
	protected constructor(protected readonly storageKey: string) { }

	protected abstract get nextLocalKey(): TKey;

	protected get allKeys(): TKey[] {
		return JSON.parse(window.localStorage.getItem(`${this.storageKey}[_all]`) || '[]');
	}

	protected set allKeys(value: TKey[]) {
		window.localStorage.setItem(`${this.storageKey}`, JSON.stringify(value));
	}

	public add(model: TModel, indexes?: StorageIndex<TModel>[]): Observable<[TKey, TModel]> {
		const key = this.nextLocalKey;
		const storageKey = this.getItemStorageKey({ key });

		const storedIndexes: StorageIndex<TModel>[] = [];

		if (indexes) {
			indexes.forEach(fields => {
				const query: StorageIndexQuery<TModel> = {};
				fields.forEach(field => query[field] = model[field] as any);

				const indexStorageKey = this.getItemStorageKey({ index: query });
				const indexedFields = JSON.parse(window.localStorage.getItem(indexStorageKey) || '[]');
				indexedFields.push(key);

				window.localStorage.setItem(indexStorageKey, JSON.stringify(indexedFields));
				storedIndexes.push(fields);
			});
		}

		window.localStorage.setItem(storageKey, JSON.stringify({
			id: key,
			model: model,
			updated: new Date().getTime(),
			isLocalChanged: true,
			indexes: storedIndexes
		} as RepositoryItem<TKey, TModel>));

		this.allKeys = this.allKeys.concat([ key ]);

		return of([ key, model ] as [TKey, TModel]);
	}

	public update(key: TKey, model: TModel): Observable<[TKey, TModel]> {
		throw new Error('Not implemented!');
	}

	public remove(key: TKey): Observable<[TKey, TModel]> {
		throw new Error('Not implemented!');
	}

	public list(): Observable<[TKey, TModel][]> {
		return forkJoin(this.allKeys.map(x => this.get(x)));
	}

	public get(key: TKey): Observable<[TKey, TModel]> {
		const storageKey = this.getItemStorageKey({ key });
		const item = JSON.parse(window.localStorage.getItem(storageKey) || 'null') as RepositoryItem<TKey, TModel> | null;

		if (!item) {
			throw new Error(`An item with the key '${key}' could not be found.`);
		}

		return of([ key, item.model ] as [TKey, TModel]);
	}

	protected getBy(query: StorageIndexQuery<TModel>): Observable<TKey[]> {
		const indexStorageKey = this.getItemStorageKey({ index: query });
		return of(JSON.parse(window.localStorage.getItem(indexStorageKey) || '[]') as TKey[]);
	}

	private getItemStorageKey({ key, index }: { key?: TKey, index?: StorageIndexQuery<TModel> }): string {
		if (key) {
			return `${this.storageKey}[=${key}]`;
		}

		if (!index) {
			throw new Error('A key or index is required to build the storage item key.');
		}

		const indexString = Object.getOwnPropertyNames(index).map(x => `${x}=${index[x as keyof TModel]}`)
		return `${this.storageKey}[${indexString}]`;
	}
}

@Injectable({ providedIn: 'root' })
export class RecipeRepository extends GenericRepository<number, Recipe> {
	public constructor() {
		super('recipes');
	}

	protected get nextLocalKey(): number {
		const key = `${this.storageKey}[_nextId]`;
		const nextId = +(window.localStorage.getItem(key) || 0);

		window.localStorage.setItem(key, (nextId + 1).toString());

		return nextId;
	}

	public getBySlug(slug: string): Observable<[number, Recipe]> {
		return this.getBy({ slug }).pipe(flatMap(matches => {
			if (matches.length === 0) {
				throw new Error(`A recipe with the slug '${slug}' could not be found.`);
			} else if (matches.length > 1) {
				throw new Error(`Found multiple recipes with the slug: '${slug}'.`);
			}

			return this.get(matches[0]);
		}));
	}
}
