import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { ListService } from '../list.service';
import { List } from '../list.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  lists: List[] = [];
  constructor(private router: Router, private listService: ListService, private toast: ToastController) { }

  ngOnInit() {
    this.listService.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.listService.getLists().subscribe(lists => {
          this.lists = lists;
        });
      }
    });
  }
  delete(id) {
    this.listService.deleteList(id).then(async (res) => {
      // tslint:disable-next-line: prefer-const
      let toast = await this.toast.create({
        message: 'List deleted',
        duration: 2500
      });
      toast.present();
    });
  }

  // addList() {
  //   this.router.navigateByUrl('/new');
  // }
}
