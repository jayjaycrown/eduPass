import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AngularFirestore } from '@angular/fire/firestore';

import { List, Scan } from './list.model';


@Injectable({
  providedIn: 'root'
})
export class ListService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  savedLists = new BehaviorSubject<List[]>([]);
  savedItems = new BehaviorSubject<Scan[]>([]);
  scanItems = new BehaviorSubject<Scan[]>([]);

  // tslint:disable-next-line: variable-name
  // private _lists: List[] = [];
  // tslint:disable-next-line: variable-name
  private _scan = new BehaviorSubject<Scan[]>([]);

  get scan() {
    return this._scan.asObservable();
  }


  constructor(
    private plt: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlitePorter: SQLitePorter,
    private firestore: AngularFirestore
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
        }).catch(err => {
          console.log(err);
        });
    });
  }

  async searchStudent(recordID) {
    // tslint:disable-next-line: prefer-const
    let document = await this.firestore.doc('Students/' + recordID).get().toPromise();
    return document.data();
    // return this.firestore.collection('Students').doc(recordID).get();
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
  getItems(): Observable<Scan[]> {
    return this.savedItems.asObservable();
  }

  getScannedItems(): Observable<Scan[]> {
    return this.scanItems.asObservable();
  }

  loadSavedLists() {
    return this.database.executeSql('SELECT * FROM savedLists', []).then(res => {
      const lists: List[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          lists.push({
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            description: res.rows.item(i).description,
          });
        }
      }
      this.savedLists.next(lists);
    });
  }
  // loading all Items
  loadSavedItems() {
    // tslint:disable-next-line: prefer-const
    let query = 'SELECT  * FROM savedItems';
    return this.database.executeSql(query, []).then(data => {
      // tslint:disable-next-line: prefer-const
      const items: Scan[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          items.push({
            id: data.rows.item(i).id,
            content: data.rows.item(i).content,
            listId: data.rows.item(i).listId
          });

        }
      }
      // this.savedItems.next(items);
    });
  }

  // Add List
  addList(title, description) {
    const q = 'INSERT INTO savedLists (title, description) VALUES (?, ?)';
    // tslint:disable-next-line: prefer-const
    let data = [title, description];
    return this.database.executeSql(q, data)
      .then(res => {
        this.loadSavedLists();
      });
  }
  addItem(content, listId) {
    const q = 'INSERT INTO savedItems (content, listId) VALUES (?, ?)';
    // tslint:disable-next-line: prefer-const
    let data = [content, listId];
    return this.database.executeSql(q, data).then(res => {
      console.log(`response is:  ${JSON.stringify(res)}`);
      this.loadSavedItems();
    }).catch(err => console.log(`Error is: ${err}`));
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

  getItemUnderList(id) {
    const data = [id];
    return this.database.executeSql('SELECT id, content FROM savedItems WHERE listId = ?', data).then(doc => {
      // tslint:disable-next-line: prefer-const
      let Items = [];
      if (doc.rows.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < doc.rows.length; i++) {
          Items.push({
            id: doc.rows.item(i).id,
            content: doc.rows.item(i).content,
          });
          console.log(`All returned Rows are ${JSON.stringify(Items)}`);
        }
      }
      this.scanItems.next(Items);
      return this.scanItems.asObservable();
    });
  }

  // Delete List
  deleteList(id) {
    return this.database.executeSql('DELETE FROM savedLists WHERE id = ?', [id])
      .then(_ => {
        return this.savedLists.asObservable();
        // this.getLists();
      });
  }
  deleteItem(id) {
    return this.database.executeSql('DELETE FROM savedItems WHERE id = ?', [id])
      .then(_ => {
        return this.scanItems.asObservable();
        // this.getScannedItems();
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






  // addScan(text: string,) {
  //   const newScan = new Scan(
  //     Math.random().toString(),
  //     text
  //   );
  //   return this.scan.pipe(
  //     take(1),
  //     delay(1000),
  //     tap(scan => {
  //       this._scan.next(scan.concat(newScan));
  //     })
  //   );
  //   // this._scan.push(newScan);
  // }
  // Add items

  // Delete List


}
