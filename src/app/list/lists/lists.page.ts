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
  constructor(
    private router: Router,
    private listService: ListService,
    private toast: ToastController,
    private loadingCtrl: LoadingController) { }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async getLists() {
   await ( this.listService.getLists()).subscribe(lists => {
      this.lists = lists;
    });
  }
  ngOnInit() {
    this.listService.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.getLists();
      }
    });
  }
  autoRefresh() {
    this.ngOnInit();
  }

  delete(id) {
    this.listService.deleteList(id).then(async (res: any) => {
      this.autoRefresh();
      const toast = await this.toast.create({
        message: 'List deleted',
        duration: 2500
      });
      toast.present();
      this.lists = res;
    }).catch(err => {
      alert(err);
    });
  }
}
