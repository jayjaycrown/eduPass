import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController, ToastController } from '@ionic/angular';

import { ListService } from '../list.service';
import { List } from '../list.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  lists: List[] = [];
  constructor(private router: Router,
              private listService: ListService,
              private toast: ToastController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.listService.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.listService.getLists().subscribe(lists => {
          this.lists = lists;
        });
      }
    });
  }
  delete(id, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.listService.deleteList(id).then( res => {
        loadingEl.dismiss();
      }).catch(err => {
        alert(err);
      });
    });

  }
}
