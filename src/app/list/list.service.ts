import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { List } from './list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  savedLists = new BehaviorSubject([]);
  savedItems = new BehaviorSubject([]);

  // tslint:disable-next-line: variable-name
  private _lists: List[] = [];


  // getLists() {
  //   return [...this._lists];
  // }

  // addList(title: string, description: string, savedItem: string[]) {
  //   const newList = new List(
  //     Math.random().toString(),
  //     title,
  //     description,
  //     []);
  //   this._lists.push(newList);
  // }

  constructor(
    private plt: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlitePorter: SQLitePorter,
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'eduPass.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
          // this.getFakeData();
        });
    });
  }

  seedDatabase() {
    this.httpClient.get(
      'assets/seed.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlitePorter.importSqlToDb(this.database, data)
        .then(_ => {
          this.loadSavedLists();
          this.loadSavedItems();
          this.dbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }
  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  getLists(): Observable<List[]> {
    return this.savedLists.asObservable();
  }
  getItems(): Observable<any[]> {
    return this.savedItems.asObservable();
  }

  loadSavedLists() {
    return this.database.executeSql('SELECT * FROM savedLists', []).then(res => {
      const savedLists: List[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          savedLists.push({
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            description: res.rows.item(i).description,
          });
        }
      }
      this.savedLists.next(savedLists);
    });
  }

  // Add List
  addList(title, description) {
    // tslint:disable-next-line: prefer-const
    let data = [title, description];
    return this.database.executeSql('INSERT INTO savedLists (title, items, description) VALUES (?, ?, ?)', data)
      .then(res => {
        this.loadSavedLists();
      });
  }

  // Get single List
  getList(id): Promise<List> {
    return this.database.executeSql('SELECT * FROM savedLists WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        title: data.rows.item(0).title,
        description: data.rows.item(0).description,
      };
    });
  }

  // Delete List
  deleteList(id) {
    return this.database.executeSql('DELETE FROM savedLists WHERE id = ?', [id])
      .then(_ => {
        this.getLists();
      });
  }

  // Update list
  updateList(list: List) {
    // tslint:disable-next-line: prefer-const
    let data = [list.title, list.description];
    return this.database.executeSql(`UPDATE savedLists SET title = ?, description = ? WHERE id = ${list.id}`, data)
      // tslint:disable-next-line: no-shadowed-variable
      .then(data => {
        this.getLists();
      });
  }









  // get all items under a list
  getItemUnderList(id: any) {
    return this.database.executeSql('SELECT savedItems.title, savedItems.content, FROM savedItems WHERE listId = ?', [id]).then(data => {
      // tslint:disable-next-line: prefer-const
      let savedItems = [];
      if (data.rows.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.rows.length; i++) {
          savedItems.push({
            id: data.rows.item(0).id,
            title: data.rows.item(0).title,
            content: data.rows.item(0).content,
          });
        }
      }
      this.savedItems.next(savedItems);
    });
  }

  // loading all Items
  loadSavedItems() {
    // tslint:disable-next-line: prefer-const
    let query = 'SELECT savedItems.title, savedItems.content, savedItems.id, list.name AS list FROM savedItems JOIN savedLists ON savedLists.id = savedItems.listId';
    return this.database.executeSql(query, []).then(data => {
      // tslint:disable-next-line: prefer-const
      let savedItems = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          savedItems.push({
            tittle: data.rows.item(i).title,
            content: data.rows.item(i).content,
            list: data.rows.item(i).list
          });

        }
      }
      this.savedItems.next(savedItems);
    });
  }



  // Add items
  addItem(title, content, list) {
    // tslint:disable-next-line: prefer-const
    let data = [title, content, list];
    return this.database.executeSql('INSERT INTO savedItems (title, content, listId) VALUES (?, ?, ?)', data).then(res => {
      this.loadSavedItems();
    });
  }
  // Delete List
  deleteItem(id) {
    return this.database.executeSql('DELETE FROM savedItems WHERE id = ?', [id])
      .then(_ => {
        this.getItems();
      });
  }

}
