import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController, LoadingController } from '@ionic/angular';

import { ListService } from '../list.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';



@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.page.html',
  styleUrls: ['./list-item.page.scss'],
})
export class ListItemPage implements OnInit {

  id: any;
  list: any;
  items: any;
  data: any;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private listService: ListService,
    private toast: ToastController,
    private barcodeScanner: BarcodeScanner,
    ) {


  }

  autoRefresh() {
    this.ngOnInit();
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async getItems(id) {
    (await this.listService.getItemUnderList(id)).subscribe(res => {
      this.items = res;
      // alert(JSON.stringify(this.items));
    });
  }

  getListDetail(id) {
    this.listService.getList(id).then(data => {
      this.list = data;
    });
  }
  addItem(data, id) {
    this.listService.addItem(data, id).then(_ => {
      // alert(JSON.stringify(res));
      this.autoRefresh();
    }).catch(err => {
      alert(err);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (!params.has('listId')) {
        this.navCtrl.navigateBack('/home/tabs/lists');
      }
      this.id = params.get('listId');
      // alert('id: ' + this.id);
      this.loadingCtrl.create({
        keyboardClose: true,
        message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
      }).then(loadingEl => {
        loadingEl.present();
        this.getListDetail(this.id);
        this.getItems(this.id);
        loadingEl.dismiss();
      });
    });
  }
  scan() {
    this.data = null;
    this.barcodeScanner.scan(
      {
        showFlipCameraButton: true,
        showTorchButton: true,
      }
    ).then(barcodeData => {
      this.data = barcodeData.text;
      this.route.paramMap.subscribe(res => {
        this.id = res.get('listId');
      });
      this.loadingCtrl.create({
        message: `
                <div class="custom-spinner-container">
                  <div class="custom-spinner-box"></div>
                </div>`
      }).then(loadingEl => {
        loadingEl.present();
        this.addItem(this.data, this.id);
        loadingEl.dismiss();
      });

    }).catch(err => {
      console.log('Error', err);
    });
  }


delete(id) {
  this.listService.deleteItem(id).then(async (res) => {
    this.autoRefresh();
      // tslint:disable-next-line: prefer-const
    let toast = await this.toast.create({
      message: 'List deleted',
      duration: 2500
    });
    toast.present();
    });
  }



}
