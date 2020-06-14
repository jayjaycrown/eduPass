import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { ListService } from '../list.service';
import { List } from '../list.model';



@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.page.html',
  styleUrls: ['./list-item.page.scss'],
})
export class ListItemPage implements OnInit {

  id: any;
  list: any;
  items: any;

  constructor(private router: Router,
              private actRoute: ActivatedRoute,
              private listService: ListService,
              private toast: ToastController) {


  }


  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.list = this.listService.getList(this.id);

    this.items = this.listService.getItemUnderList(this.id);
  }


  delete(id) {
    this.listService.deleteItem(id).then(async (res) => {
      // tslint:disable-next-line: prefer-const
      let toast = await this.toast.create({
        message: 'List deleted',
        duration: 2500
      });
      toast.present();
    });
  }

}
